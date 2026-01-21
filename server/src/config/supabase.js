import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'your-service-key'

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database helper functions
export const db = {
  // Users
  async getUserById(id) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()
    return { data, error }
  },

  async getAllPatients() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'patient')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async updateUser(id, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  // Appointments
  async createAppointment(appointment) {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointment])
      .select()
      .single()
    return { data, error }
  },

  async getAppointmentsByPatient(patientId) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', patientId)
      .order('date', { ascending: true })
    return { data, error }
  },

  async getAppointmentsByDate(date) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:profiles!patient_id(id, name, email)
      `)
      .eq('date', date)
      .order('time', { ascending: true })
    return { data, error }
  },

  async updateAppointment(id, updates) {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async deleteAppointment(id) {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)
    return { error }
  },

  // Diet Logs
  async createDietLog(log) {
    const { data, error } = await supabase
      .from('diet_logs')
      .insert([log])
      .select()
      .single()
    return { data, error }
  },

  async getDietLogsByPatient(patientId, date = null) {
    let query = supabase
      .from('diet_logs')
      .select('*')
      .eq('patient_id', patientId)
    
    if (date) {
      query = query.eq('date', date)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    return { data, error }
  },

  async getDietLogsByDate(patientId, startDate, endDate) {
    const { data, error } = await supabase
      .from('diet_logs')
      .select('*')
      .eq('patient_id', patientId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })
    return { data, error }
  },

  async deleteDietLog(id) {
    const { error } = await supabase
      .from('diet_logs')
      .delete()
      .eq('id', id)
    return { error }
  }
}

export default supabase


