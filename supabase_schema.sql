-- Supabase SQL Schema for OB/GYN Clinic Management App
-- Run this in the Supabase SQL editor to set up the database

-- 1. Create Patients Table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  phone VARCHAR(20),
  history JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Medicines Table
CREATE TABLE medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_name VARCHAR(255) NOT NULL,
  scientific_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  form VARCHAR(50) NOT NULL,
  concentration VARCHAR(50),
  default_dosage TEXT NOT NULL,
  price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Prescriptions Table
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  medicines_list JSONB DEFAULT '[]',
  notes TEXT,
  doctor_name VARCHAR(255),
  clinic_name VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Indexes for Better Performance
CREATE INDEX idx_patients_phone ON patients(phone);
CREATE INDEX idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX idx_medicines_category ON medicines(category);

-- 5. Enable Row Level Security (RLS) - Optional but Recommended
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (for development; restrict in production)
CREATE POLICY "Allow public read on medicines" ON medicines FOR SELECT USING (true);
CREATE POLICY "Allow public insert on patients" ON patients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on patients" ON patients FOR SELECT USING (true);
CREATE POLICY "Allow public insert on prescriptions" ON prescriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on prescriptions" ON prescriptions FOR SELECT USING (true);
CREATE POLICY "Allow public update on prescriptions" ON prescriptions FOR UPDATE USING (true);
