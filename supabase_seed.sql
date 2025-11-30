-- Seed Data Script for Egyptian OB/GYN Medicines
-- Insert essential drugs used in Egypt

INSERT INTO medicines (trade_name, scientific_name, category, form, concentration, default_dosage, price) VALUES

-- Category: Ovulation Induction (تنشيط التبويض)
('Clomid', 'Clomiphene Citrate', 'Ovulation Induction', 'Tablets', '50mg', 'قرص مرتين يومياً من اليوم الثاني للدورة لمدة 5 أيام', 15.00),
('Femara', 'Letrozole', 'Ovulation Induction', 'Tablets', '2.5mg', 'قرصين مرة واحدة يومياً من اليوم الثالث للدورة لمدة 5 أيام', 25.00),
('Cidophage', 'Metformin', 'Ovulation Induction', 'Tablets', '850mg', 'قرص واحد بعد الغداء يومياً', 8.00),

-- Category: Luteal Support (تثبيت الحمل)
('Cyclogest', 'Progesterone', 'Luteal Support', 'Pessaries', '400mg', 'لبوسة مهبلية مساءً قبل النوم', 45.00),
('Prontogest', 'Progesterone', 'Luteal Support', 'Injection', '100mg/1ml', 'حقنة عضل يومياً', 12.00),
('Duphaston', 'Dydrogesterone', 'Luteal Support', 'Tablets', '10mg', 'قرص مرتين يومياً', 18.00),

-- Category: Supplements & Vitamins (مكملات الحمل)
('Folicap', 'Folic Acid', 'Supplements & Vitamins', 'Tablets', '0.5mg', 'قرص واحد يومياً', 5.00),
('Feroglobin', 'Iron + Vitamin B12', 'Supplements & Vitamins', 'Capsules', '-', 'كبسولة واحدة بعد الغداء', 22.00),
('Osteocare', 'Calcium + Magnesium', 'Supplements & Vitamins', 'Tablets', '-', 'قرص واحد يومياً', 18.00),

-- Category: Antibiotics & PID (مضادات حيوية)
('Vibramycin', 'Doxycycline', 'Antibiotics & PID', 'Capsules', '100mg', 'كبسولة كل 12 ساعة لمدة 14 يوم', 20.00),
('Flagyl', 'Metronidazole', 'Antibiotics & PID', 'Tablets', '500mg', 'قرص كل 12 ساعة لمدة 7 أيام', 10.00),
('Dflucan', 'Fluconazole', 'Antibiotics & PID', 'Capsules', '150mg', 'كبسولة واحدة مرة واحدة فقط', 35.00);

-- Optional: Insert sample patient
INSERT INTO patients (name, age, phone, history) VALUES
('علياء محمد', 32, '01012345678', '{"complaints": "العقم الثانوي", "duration": "24 months"}');
