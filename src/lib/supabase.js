import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey)

// ========== PATIENTS ==========
export const patientService = {
  async getAll(filters = {}) {
    let query = supabase.from('patients').select('*')
    
    if (filters.clinic_id) query = query.eq('clinic_id', filters.clinic_id)
    if (filters.status) query = query.eq('status', filters.status)
    if (filters.search) query = query.ilike('name', `%${filters.search}%`)
    
    const { data, error } = await query.order('created_at', { ascending: false })
    return { data, error }
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  async create(patient) {
    const { data, error } = await supabase
      .from('patients')
      .insert([{ ...patient, created_at: new Date(), updated_at: new Date() }])
      .select()
    return { data, error }
  },

  async update(id, patient) {
    const { data, error } = await supabase
      .from('patients')
      .update({ ...patient, updated_at: new Date() })
      .eq('id', id)
      .select()
    return { data, error }
  },

  async delete(id) {
    const { data, error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id)
    return { data, error }
  },

  async search(query) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .or(`name.ilike.%${query}%,phone.ilike.%${query}%`)
    return { data, error }
  },
}

// ========== DIAGNOSES ==========
export const diagnosisService = {
  async getByPatient(patientId) {
    const { data, error } = await supabase
      .from('diagnoses')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async create(diagnosis) {
    const { data, error } = await supabase
      .from('diagnoses')
      .insert([{ ...diagnosis, created_at: new Date() }])
      .select()
    return { data, error }
  },

  async update(id, diagnosis) {
    const { data, error } = await supabase
      .from('diagnoses')
      .update({ ...diagnosis, updated_at: new Date() })
      .eq('id', id)
      .select()
    return { data, error }
  },
}

// ========== PRESCRIPTIONS ==========
export const prescriptionService = {
  async getByDiagnosis(diagnosisId) {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*, medicines(*)')
      .eq('diagnosis_id', diagnosisId)
    return { data, error }
  },

  async getByPatient(patientId) {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*, diagnoses(patient_id), medicines(*)')
      .eq('diagnoses.patient_id', patientId)
    return { data, error }
  },

  async create(prescription) {
    const { data, error } = await supabase
      .from('prescriptions')
      .insert([{ ...prescription, created_at: new Date() }])
      .select()
    return { data, error }
  },

  async update(id, prescription) {
    const { data, error } = await supabase
      .from('prescriptions')
      .update({ ...prescription, updated_at: new Date() })
      .eq('id', id)
      .select()
    return { data, error }
  },

  async delete(id) {
    const { data, error } = await supabase
      .from('prescriptions')
      .delete()
      .eq('id', id)
    return { data, error }
  },
}

// ========== MEDICINES ==========
export const medicineService = {
  async getAll(filters = {}) {
    let query = supabase.from('medicines').select('*')
    
    if (filters.category) query = query.eq('category', filters.category)
    if (filters.status) query = query.eq('status', filters.status)
    if (filters.search) query = query.ilike('name', `%${filters.search}%`)
    
    const { data, error } = await query.order('name')
    return { data, error }
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  async create(medicine) {
    const { data, error } = await supabase
      .from('medicines')
      .insert([{ ...medicine, created_at: new Date() }])
      .select()
    return { data, error }
  },

  async update(id, medicine) {
    const { data, error } = await supabase
      .from('medicines')
      .update({ ...medicine, updated_at: new Date() })
      .eq('id', id)
      .select()
    return { data, error }
  },

  async delete(id) {
    const { data, error } = await supabase
      .from('medicines')
      .delete()
      .eq('id', id)
    return { data, error }
  },
}

// ========== USERS & AUTHENTICATION ==========
export const userService = {
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser()
    return { data, error }
  },

  async signUp({ email, password, metadata } = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    })
    return { data, error }
  },

  async signIn({ email, password } = {}) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getProfile(userId) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    return { data, error }
  },

  async updateProfile(userId, profile) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(profile)
      .eq('user_id', userId)
      .select()
    return { data, error }
  },

  async createProfile(userId, profile) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([{ user_id: userId, ...profile }])
      .select()
    return { data, error }
  },

  async getAllStaff(clinicId) {
    if (!clinicId) return { data: [], error: null }
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('clinic_id', clinicId)
    return { data, error }
  },

  async grantPermission(userId, permission) {
    const { data, error } = await supabase
      .from('user_permissions')
      .insert([{ user_id: userId, permission }])
    return { data, error }
  },

  async revokePermission(userId, permission) {
    const { data, error } = await supabase
      .from('user_permissions')
      .delete()
      .eq('user_id', userId)
      .eq('permission', permission)
    return { data, error }
  },
}

// ========== AUDIT LOGS ==========
export const auditService = {
  async log(action, details, userId) {
    const { error } = await supabase
      .from('audit_logs')
      .insert([{
        action,
        details,
        user_id: userId,
        created_at: new Date(),
      }])
    return { error }
  },

  async getByUser(userId, limit = 100) {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    return { data, error }
  },

  async getAll(limit = 1000) {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    return { data, error }
  },
}

// ========== ANALYTICS ==========
export const analyticsService = {
  async getStats(clinicId) {
    if (!clinicId) return { totalPatients: 0, totalDiagnoses: 0 }

    const { data: patients } = await supabase
      .from('patients')
      .select('id', { count: 'exact', head: true })
      .eq('clinic_id', clinicId)

    const { data: diagnoses } = await supabase
      .from('diagnoses')
      .select('id', { count: 'exact', head: true })
      .eq('clinic_id', clinicId)

    return {
      totalPatients: patients?.length || 0,
      totalDiagnoses: diagnoses?.length || 0,
    }
  },

  async getPatientStats(patientId) {
    const { data: diagnoses } = await supabase
      .from('diagnoses')
      .select('*')
      .eq('patient_id', patientId)

    const { data: prescriptions } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('patient_id', patientId)

    return {
      diagnosisCount: diagnoses?.length || 0,
      prescriptionCount: prescriptions?.length || 0,
      lastDiagnosis: diagnoses?.[0]?.created_at,
    }
  },
}

// ========== EXPORT FUNCTIONALITY ==========
export const exportService = {
  async exportPatientData(patientId) {
    const { data: patient } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single()

    const { data: diagnoses } = await supabase
      .from('diagnoses')
      .select('*')
      .eq('patient_id', patientId)

    const { data: prescriptions } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('patient_id', patientId)

    return {
      patient,
      diagnoses,
      prescriptions,
    }
  },

  async exportToPDF(patientData) {
    // Placeholder for PDF export logic
    return patientData
  },
}

// ========== BACKUP FUNCTIONALITY ==========
export const backupService = {
  async createBackup(clinicId) {
    if (!clinicId) return { timestamp: new Date().toISOString(), patients: [], diagnoses: [] }

    const { data: patients } = await supabase
      .from('patients')
      .select('*')
      .eq('clinic_id', clinicId)

    const { data: diagnoses } = await supabase
      .from('diagnoses')
      .select('*')
      .eq('clinic_id', clinicId)

    const backupData = {
      timestamp: new Date().toISOString(),
      patients,
      diagnoses,
    }

    return backupData
  },

  async restoreBackup(backupData) {
    // Placeholder for restore logic
    return true
  },
}

export default supabase
