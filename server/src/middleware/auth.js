import jwt from 'jsonwebtoken'
import { supabase } from '../config/supabase.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'

// Verify JWT token
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]

    // Verify with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    // Attach user to request
    req.user = user
    req.token = token
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(401).json({ error: 'Authentication failed' })
  }
}

// Check if user is a dietitian
export const isDietitian = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single()

    if (error || !profile) {
      return res.status(403).json({ error: 'Profile not found' })
    }

    if (profile.role !== 'dietitian') {
      return res.status(403).json({ error: 'Dietitian access required' })
    }

    req.userRole = 'dietitian'
    next()
  } catch (error) {
    console.error('Dietitian check error:', error)
    return res.status(500).json({ error: 'Authorization check failed' })
  }
}

// Check if user is a patient
export const isPatient = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single()

    if (error || !profile) {
      return res.status(403).json({ error: 'Profile not found' })
    }

    if (profile.role !== 'patient') {
      return res.status(403).json({ error: 'Patient access required' })
    }

    req.userRole = 'patient'
    next()
  } catch (error) {
    console.error('Patient check error:', error)
    return res.status(500).json({ error: 'Authorization check failed' })
  }
}

// Allow both dietitian and patient with specific conditions
export const isAuthenticated = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single()

    if (error || !profile) {
      return res.status(403).json({ error: 'Profile not found' })
    }

    req.profile = profile
    req.userRole = profile.role
    next()
  } catch (error) {
    console.error('Auth check error:', error)
    return res.status(500).json({ error: 'Authorization check failed' })
  }
}

export default { verifyToken, isDietitian, isPatient, isAuthenticated }


