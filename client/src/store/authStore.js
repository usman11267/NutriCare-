import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase, signIn, signUp, signOut, getProfile } from '../config/supabase'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Initialize auth state
      initialize: async () => {
        set({ isLoading: true })
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user) {
            const { data: profile } = await getProfile(session.user.id)
            set({ 
              user: { ...session.user, role: profile?.role || 'patient' },
              profile,
              isAuthenticated: true 
            })
          }
        } catch (error) {
          console.error('Auth initialization error:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      // Login
      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const { data, error } = await signIn(email, password)
          if (error) throw error
          
          const { data: profile } = await getProfile(data.user.id)
          set({ 
            user: { ...data.user, role: profile?.role || 'patient' },
            profile,
            isAuthenticated: true,
            isLoading: false 
          })
          return { success: true, role: profile?.role }
        } catch (error) {
          set({ error: error.message, isLoading: false })
          return { success: false, error: error.message }
        }
      },

      // Register
      register: async (email, password, userData) => {
        set({ isLoading: true, error: null })
        try {
          const { data, error } = await signUp(email, password, userData)
          if (error) throw error
          
          // Note: Profile is automatically created by database trigger (handle_new_user)
          // Wait a moment for the trigger to complete
          await new Promise(resolve => setTimeout(resolve, 500))
          
          set({ isLoading: false })
          return { success: true, message: 'Registration successful! Please check your email.' }
        } catch (error) {
          set({ error: error.message, isLoading: false })
          return { success: false, error: error.message }
        }
      },

      // Logout
      logout: async () => {
        set({ isLoading: true })
        try {
          await signOut()
          set({ 
            user: null, 
            profile: null, 
            isAuthenticated: false, 
            isLoading: false 
          })
        } catch (error) {
          set({ error: error.message, isLoading: false })
        }
      },

      // Update profile
      updateProfile: async (updates) => {
        const { user } = get()
        if (!user) return { success: false }
        
        try {
          const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single()
          
          if (error) throw error
          set({ profile: data })
          return { success: true }
        } catch (error) {
          return { success: false, error: error.message }
        }
      },

      // Clear error
      clearError: () => set({ error: null })
    }),
    {
      name: 'nutricare-auth',
      partialize: (state) => ({ 
        user: state.user, 
        profile: state.profile, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
)


