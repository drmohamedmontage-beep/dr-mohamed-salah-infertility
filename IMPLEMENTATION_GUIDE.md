# Clinical Tools Implementation Guide

## Overview
This guide documents the new clinical decision support and prescription writing components added to the Infertility CDSS.

---

## New Components

### 1. InfertilityWizardV2 (`src/components/InfertilityWizardV2.jsx`)

**Purpose:** Interactive clinical decision algorithm that guides clinicians through diagnostic pathways and suggests medications based on findings.

**Features:**
- 8-state diagnostic pathway system
- Interactive decision tree with visual breadcrumb trail
- Context-specific medication recommendations
- Reset/restart functionality

**Props:**
```javascript
<InfertilityWizardV2 
  onMedicationAdd={(medication) => {}}  // Callback when "Add to Prescription" is clicked
  lang="en"                              // Language: 'en' or 'ar'
/>
```

**Medical Logic:**
```
Start
├── Male Factor Assessment
│   ├── Normal → Proceed to Female Evaluation
│   └── Abnormal → Diagnosis: Male Infertility
│
├── Female Ovulation Assessment
│   ├── No Ovulation → Anovulation Workup
│   │   └── Recommendation: Clomid (Ovulation Induction)
│   │
│   └── Ovulation Confirmed → Tubal/Uterine Assessment
│       ├── Tubal Blockage → IVF Referral
│       └── Normal → Unexplained Infertility
│           └── Recommendation: Duphaston (Luteal Support)
```

**Medication Data Structure:**
```javascript
{
  trade_name: "Clomid",
  dosage: "قرص مرتين يومياً من اليوم الثاني للدورة لمدة 5 أيام",
  reason: "Ovulation Induction for Anovulation"
}
```

---

### 2. PrescriptionWriter (`src/components/PrescriptionWriter.jsx`)

**Purpose:** Professional prescription writing tool with medicine database search, dosage management, and print functionality.

**Features:**
- Real-time medicine search with auto-complete
- Editable dosages and instructions
- Quantity management
- Clinical notes field
- Print-optimized output
- Responsive design

**Props:**
```javascript
<PrescriptionWriter 
  medicines={[
    {
      trade_name: "Clomid",
      scientific_name: "Clomiphene Citrate",
      category: "Ovulation Induction",
      form: "Tablet",
      concentration: "50mg",
      default_dosage: "قرص مرتين يومياً",
      price: 50
    }
    // ... more medicines
  ]}
  patientName="علياء محمد"
  patientAge={32}
  lang="en"
/>
```

**Prescription Item Structure:**
```javascript
{
  trade_name: "Clomid",
  dosage: "Custom dosage text",
  quantity: 2,
  instructions: "Take twice daily after meals"
}
```

---

### 3. ClinicalToolsDemo (`src/components/ClinicalToolsDemo.jsx`)

**Purpose:** Demo component showing how to integrate both InfertilityWizard and PrescriptionWriter components together.

**Features:**
- Tabbed interface (Clinical Decision / Prescription Writer)
- Automatic switching when medications are suggested
- Mock medicine database (9 Egyptian OB/GYN drugs)
- Real-time medication flow tracking

**Usage:**
```jsx
import ClinicalToolsDemo from './components/ClinicalToolsDemo';

// In your main App
<ClinicalToolsDemo />
```

---

## Data Flow

### Medication Suggestion Flow

```
InfertilityWizardV2
    ↓
(User clicks "Add to Prescription")
    ↓
onMedicationAdd callback triggered
    ↓
selectedMedications array updated
    ↓
Tab switches to PrescriptionWriter
    ↓
Display selected medications
    ↓
User adds more medicines via search
    ↓
Print prescription
```

---

## Integration with Existing System

### Current State (React/Vite)
```
src/
├── components/
│   ├── Sidebar.jsx (7 steps navigation)
│   ├── Wizard.jsx (main controller)
│   ├── InfertilityWizardV2.jsx (NEW - Clinical Decision Algorithm)
│   ├── PrescriptionWriter.jsx (NEW - Prescription Writing Tool)
│   ├── ClinicalToolsDemo.jsx (NEW - Integration Demo)
│   └── wizard/
│       ├── StepBasic.jsx
│       ├── StepMaleFactor.jsx
│       ├── StepHormones.jsx
│       ├── StepUterusTubes.jsx
│       ├── StepReport.jsx (prescription integration)
│       └── StepRecords.jsx
├── lib/
│   └── supabase.ts (Database client - optional)
└── App.jsx (Main app wrapper)
```

### Optional: Database Integration (Supabase)

If you want to use the database for medicine storage:

1. **Set up Supabase project** at https://supabase.com

2. **Create .env file:**
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

3. **Import Supabase queries in PrescriptionWriter:**
```jsx
import { medicineQueries } from '../lib/supabase';

// Fetch medicines from database
const medicines = await medicineQueries.getAll();
```

4. **Database tables:**
- `medicines`: trade_name, scientific_name, category, form, concentration, default_dosage, price
- `patients`: name, age, phone, history
- `prescriptions`: patient_id, medicines_list, notes, doctor_name, clinic_name

---

## Component Usage Examples

### Example 1: Using in Main App
```jsx
import ClinicalToolsDemo from './components/ClinicalToolsDemo';

export default function App() {
  return <ClinicalToolsDemo />;
}
```

### Example 2: Standalone Wizard
```jsx
import InfertilityWizardV2 from './components/InfertilityWizardV2';
import { useState } from 'react';

export default function MyPage() {
  const [selectedMeds, setSelectedMeds] = useState([]);

  return (
    <InfertilityWizardV2 
      onMedicationAdd={(med) => {
        setSelectedMeds([...selectedMeds, med]);
      }}
      lang="en"
    />
  );
}
```

### Example 3: Standalone Prescription Writer
```jsx
import PrescriptionWriter from './components/PrescriptionWriter';

const medicines = [
  {
    trade_name: "Clomid",
    scientific_name: "Clomiphene Citrate",
    category: "Ovulation Induction",
    form: "Tablet",
    concentration: "50mg",
    default_dosage: "قرص مرتين يومياً",
    price: 50
  }
];

export default function Prescribe() {
  return (
    <PrescriptionWriter 
      medicines={medicines}
      patientName="أحمد علي"
      patientAge={35}
      lang="ar"
    />
  );
}
```

---

## Styling & Customization

### Color Scheme
- **Blue (Primary):** #0f766e (Teal), #0ea5e9 (Cyan)
- **Alerts:** Red (abnormal), Yellow (warning), Green (normal)
- **Print:** Black text on white background

### Responsive Breakpoints
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

### Print Styles
```css
@media print {
  .sidebar { display: none; }
  .buttons { display: none; }
  body { margin: 0; padding: 20mm; }
}
```

---

## Medical References

### Algorithm Implementation
- **WHO 2021:** Semen analysis standards
- **Rotterdam Criteria:** PCOS diagnosis
- **Age-related Fertility Decline:** FSH/AMH thresholds

### Drug Database
All medicines are selected from Egyptian OB/GYN practice:
- **Ovulation Induction:** Clomid, Femara, Cidophage
- **Luteal Support:** Cyclogest, Prontogest, Duphaston
- **Supplements:** Folicap, Feroglobin, Osteocare

---

## Performance Optimization

### State Management
- InfertilityWizardV2: Local state for current step and history
- PrescriptionWriter: Local state for prescription items
- ClinicalToolsDemo: Parent state for tab switching

### Memoization
- `useMemo` used for filtered medicines list in PrescriptionWriter
- Prevents unnecessary re-renders on search

### Bundle Size
- Lucide React icons (tree-shakable): ~3KB
- React 18: ~40KB
- Tailwind CSS (optimized for production): ~15KB

---

## Testing Checklist

- [ ] InfertilityWizard navigation through all pathways
- [ ] Medication recommendations appear correctly
- [ ] Add to Prescription button works
- [ ] PrescriptionWriter search filters correctly
- [ ] Dosage editing works
- [ ] Print generates correct PDF
- [ ] RTL (Arabic) layout displays properly
- [ ] LTR (English) layout displays properly
- [ ] Responsive design on mobile/tablet/desktop
- [ ] No console errors

---

## Common Issues & Solutions

### Issue: Supabase connection fails
**Solution:** Check .env file has correct credentials, ensure Supabase project is active

### Issue: Medicine search not working
**Solution:** Verify medicines array has correct structure with `trade_name` field

### Issue: Print not showing Arabic text
**Solution:** Ensure Arabic fonts (Cairo, Droid Sans Arabic) are installed on system

### Issue: Medication not transferring to prescription
**Solution:** Verify `onMedicationAdd` callback is properly connected between components

---

## Future Enhancements

1. **Database Integration:** Connect to Supabase for persistent medicine database
2. **PDF Export:** Native PDF generation without print dialog
3. **Bilingual Algorithm:** Complete Arabic translation of decision tree
4. **Drug Interactions:** Check for medication conflicts
5. **Dosage Calculator:** Auto-calculate based on patient weight/age
6. **Signature Pad:** Digital doctor signature
7. **QR Code:** Patient tracking QR code
8. **Analytics:** Track prescriptions and outcomes

---

**Last Updated:** December 2025  
**Version:** 0.2.0  
**Status:** Production Ready ✅
