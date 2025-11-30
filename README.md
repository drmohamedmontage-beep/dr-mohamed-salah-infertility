# Infertility Clinical Decision Support System (CDSS)
**Dr. Mohamed Salah - Obstetrics & Gynecology Clinic**

A comprehensive, bilingual (Arabic/English) web application for diagnosing and managing infertility cases based on WHO 2021, RCOG, and NICE guidelines.

---

## 🎯 Features

### 1. **Bilingual Support (Arabic/English)**
- Full RTL support for Arabic with a language toggle button
- All medical terms translated for accessibility
- Persistent language preference

### 2. **Step-by-Step Diagnostic Wizard**

#### **Step 1: Patient Demographics**
- Name, Age, BMI calculation, Weight, Height
- Duration of infertility
- Type classification (Primary/Secondary)
- Medical reference hints for WHO guidelines

#### **Step 2: Male Factor (WHO 2021 Standards)**
- Sperm count (M/mL) - WHO threshold: 15M/mL
- Motility (%) - WHO threshold: 40%
- Morphology (%) - WHO threshold: 4%
- Pus cells detection (Leukocytospermia if >1M)
- Real-time flag for abnormal values with color-coded alerts

#### **Step 3: Hormonal Profile & Ovulation**
- FSH, LH, E2 (Day 3)
- AMH (Anti-Müllerian Hormone)
- TSH, Prolactin levels
- Progesterone (Day 21) for ovulation confirmation
- AFC (Antral Follicle Count)
- **Automated Detection:**
  - PCOS (Rotterdam criteria: irregular cycles + elevated AMH/LH:FSH ratio)
  - Diminished Ovarian Reserve (high FSH or low AMH)
  - Thyroid disorders
  - Hyperprolactinemia

#### **Step 4: Uterine & Tubal Factor**
- Tubal patency assessment (Patent, Unilateral/Bilateral Blocked)
- Uterine cavity status (Normal, Fibroids, Polyps, Septate, Asherman)
- Auto-flagging for bilateral tubal blockage (IVF indication)

#### **Step 5: Report & Management Plan**
- **Auto-Diagnosis Engine:** Aggregates all findings into a prioritized diagnosis list
- **Smart Prescription System:**
  - Drug database categorized (Induction, IVF, Luteal Support, Supplements)
  - Quick-select medications with pre-filled dosages
  - Severity color-coding (High=Red, Medium=Yellow, Low=Green)
- **Print-friendly Output:** Optimized for PDF printing with clean formatting

#### **Step 6: Patient Records**
- LocalStorage-based patient database
- View, edit, delete saved records
- Export patient summaries

#### **Step 7: Clinical Decision Algorithm**
- **Interactive Decision Tree:** Flow through diagnostic pathways
- **Algorithm Stages:**
  1. Male factor assessment
  2. Female ovulation status
  3. Tubal/uterine pathology
  4. Diagnosis and recommendations
- **Smart Medication Suggestions:** Auto-recommends medications based on diagnosis
- **Integration with Prescription Writer:** Seamlessly add suggested medications to prescription

#### **NEW: Prescription Writer Component**
- **Medicine Search & Auto-complete:** Search from database of Egyptian OB/GYN medications
- **Dosage Management:** Pre-filled dosages with manual override capability
- **Quantity & Instructions:** Customize quantity and special instructions for each medication
- **Integrated Medications:** Automatically receives medications from clinical decision algorithm
- **Print Functionality:** Generate print-ready prescriptions
- **Bilingual Support:** Arabic drug names and dosages

---

## 🏥 Medical Intelligence

### Validation Logic
- **WHO 2021 Semen Analysis Standards** applied in real-time
- **PCOS Detection** using Rotterdam criteria
- **DOR Stratification** via FSH/AMH ratios
- **Thyroid Screening** with TSH normalization (target <2.5 for fertility)
- **Clinical Decision Algorithm** with 8-state diagnostic pathways

### Management Recommendations
- Evidence-based treatment plans based on diagnosis
- First-line vs. escalation protocols
- Tailored IVF indications
- Egyptian drug market focus with localized dosages

---

## 🛠️ Tech Stack

- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS (Medical blue/teal theme)
- **Icons:** Lucide React
- **State Management:** React Hooks
- **Data Persistence:** Browser LocalStorage
- **Backend (Optional):** Supabase for clinic management
- **Language:** Bilingual (Arabic RTL / English LTR)

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16+) and npm

### Quick Start

```bash
# Install dependencies
npm install

# Install Supabase (optional for backend features)
npm install @supabase/supabase-js

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`

---

## 🔧 Component Usage

### Clinical Tools Demo
To see both components in action, import and use `ClinicalToolsDemo`:

```jsx
import ClinicalToolsDemo from './components/ClinicalToolsDemo';

export default function App() {
  return <ClinicalToolsDemo />;
}
```

### Individual Components

**InfertilityWizard:**
```jsx
<InfertilityWizardV2 
  onMedicationAdd={(med) => console.log(med)}
  lang="en"
/>
```

**PrescriptionWriter:**
```jsx
<PrescriptionWriter 
  medicines={medicinesArray}
  patientName="علياء محمد"
  patientAge={32}
  lang="en"
/>
```

---

## 📱 Responsive Design

- **Desktop:** Full sidebar + content layout
- **Tablet:** Optimized for iPad (270mm x 190mm landscape)
- **Mobile:** Simplified sidebar with collapsible navigation
- **Print Mode:** Hides sidebar, formats for A4 PDF output

---

## 💾 Data Storage

Patient records are saved to browser LocalStorage:
```json
{
  "id": 1234567890,
  "name": "Patient Name",
  "age": 32,
  "weight": 70,
  "height": 165,
  "type": "Primary",
  "diagnosis": "PCOS + Mild Male Factor",
  "prescription": "Letrozole 5mg daily + Metformin 1000mg",
  "createdAt": "12/1/2025"
}
```

---

## 🖨️ Print Mode

- Accessible via "Print" button in Prescription Writer
- Auto-hides sidebar and navigation
- Optimized CSS for clean A4 layout
- Includes patient info, medications, and clinical notes

---

## 🌐 Language Support

- **English:** LTR layout with all medical guidelines in English
- **العربية (Arabic):** RTL layout with full Arabic translations including Egyptian drug names and dosages

Toggle via button in sidebar header.

---

## 📋 Medical References

All recommendations follow:
- **WHO 2021** - Laboratory manual for semen analysis
- **RCOG** - Recurrent pregnancy loss, PCOS, DOR guidelines
- **NICE** - Fertility assessment and treatment for people with fertility problems

---

## 🚀 Future Enhancements

- Supabase backend integration for multi-user clinic management
- PDF export functionality
- Patient questionnaire integration
- Multi-doctor clinic support with role-based access
- Advanced analytics dashboard for clinic statistics
- Mobile app version
- Telemedicine integration

---

## 📝 License

This system is proprietary to Dr. Mohamed Salah's clinic and is provided for clinical use only.

---

## 🤝 Support

For technical issues or feature requests, contact the development team.

---

**Version:** 0.2.0  
**Last Updated:** December 2025  
**Status:** Production Ready ✅

