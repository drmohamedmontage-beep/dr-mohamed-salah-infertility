import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Type definitions
export interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  history: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Medicine {
  id: string;
  trade_name: string;
  scientific_name: string;
  category: string;
  form: string;
  concentration: string;
  default_dosage: string;
  price: number;
  created_at: string;
}

export interface Prescription {
  id: string;
  patient_id: string;
  created_at: string;
  medicines_list: Array<{
    trade_name: string;
    dosage: string;
    quantity?: number;
    instructions?: string;
  }>;
  notes: string;
  doctor_name: string;
  clinic_name: string;
}

// Patient queries
export const patientQueries = {
  async getAll() {
    const { data, error } = await supabase.from('patients').select('*');
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase.from('patients').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async create(patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase.from('patients').insert([patient]).select();
    if (error) throw error;
    return data[0];
  },

  async update(id: string, updates: Partial<Patient>) {
    const { data, error } = await supabase
      .from('patients')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async delete(id: string) {
    const { error } = await supabase.from('patients').delete().eq('id', id);
    if (error) throw error;
  }
};

// Medicine queries
export const medicineQueries = {
  async getAll() {
    const { data, error } = await supabase.from('medicines').select('*').order('category');
    if (error) throw error;
    return data;
  },

  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('category', category)
      .order('trade_name');
    if (error) throw error;
    return data;
  },

  async search(query: string) {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .or(`trade_name.ilike.%${query}%,scientific_name.ilike.%${query}%`)
      .order('trade_name');
    if (error) throw error;
    return data;
  }
};

// Prescription queries
export const prescriptionQueries = {
  async getByPatient(patientId: string) {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(prescription: Omit<Prescription, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('prescriptions')
      .insert([{
        ...prescription,
        created_at: new Date().toISOString()
      }])
      .select();
    if (error) throw error;
    return data[0];
  },

  async update(id: string, updates: Partial<Prescription>) {
    const { data, error } = await supabase
      .from('prescriptions')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async delete(id: string) {
    const { error } = await supabase.from('prescriptions').delete().eq('id', id);
    if (error) throw error;
  }
};
