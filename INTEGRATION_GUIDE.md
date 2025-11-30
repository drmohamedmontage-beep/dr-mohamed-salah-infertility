# Integration Instructions

## Adding Clinical Tools to Existing Wizard

If you want to integrate the new clinical tools into your existing 7-step wizard instead of using the demo, follow these steps:

---

## Option A: Add as Step 8 (Recommended)

### 1. Update `src/components/Sidebar.jsx`

Add "Clinical Tools" as an 8th step:

```jsx
const steps = [
  { number: 1, label: lang === 'ar' ? 'البيانات الأساسية' : 'Basic Info', icon: User },
  { number: 2, label: lang === 'ar' ? 'العامل الذكري' : 'Male Factor', icon: Microscope },
  { number: 3, label: lang === 'ar' ? 'الهرمونات' : 'Hormones', icon: Flask },
  { number: 4, label: lang === 'ar' ? 'الرحم والأنابيب' : 'Uterus/Tubes', icon: Heart },
  { number: 5, label: lang === 'ar' ? 'التقرير' : 'Report', icon: FileText },
  { number: 6, label: lang === 'ar' ? 'السجلات' : 'Records', icon: Database },
  { number: 7, label: lang === 'ar' ? 'الخوارزمية' : 'Algorithm', icon: Stethoscope },
  // ADD THIS:
  { number: 8, label: lang === 'ar' ? 'الأدوات السريرية' : 'Clinical Tools', icon: ClipboardList }
];
```

### 2. Update `src/components/Wizard.jsx`

Add imports at the top:
```jsx
import InfertilityWizardV2 from './InfertilityWizardV2';
import PrescriptionWriter from './PrescriptionWriter';
```

Add state for medicines from algorithm:
```jsx
const [medicinesFromAlgorithm, setMedicinesFromAlgorithm] = useState([]);

const handleMedicationFromAlgorithm = (medication) => {
  setMedicinesFromAlgorithm([...medicinesFromAlgorithm, medication]);
  // Auto-switch to prescription writer after a short delay
  setTimeout(() => setCurrentTab('prescription'), 500);
};
```

Add mock medicines (or load from Supabase):
```jsx
const mockMedicines = [
  {
    trade_name: 'Clomid',
    scientific_name: 'Clomiphene Citrate',
    category: 'Ovulation Induction',
    form: 'Tablet',
    concentration: '50mg',
    default_dosage: 'قرص مرتين يومياً من اليوم الثاني للدورة لمدة 5 أيام',
    price: 50
  },
  // ... add all 9 medicines from ClinicalToolsDemo
];
```

Add step rendering in the main switch:
```jsx
case 7: // Clinical Tools
  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setCurrentTab('algorithm')}
          className={`px-4 py-2 font-medium ${
            currentTab === 'algorithm'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          Clinical Decision
        </button>
        <button
          onClick={() => setCurrentTab('prescription')}
          className={`px-4 py-2 font-medium ${
            currentTab === 'prescription'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          Prescription Writer
        </button>
      </div>

      {currentTab === 'algorithm' && (
        <InfertilityWizardV2
          onMedicationAdd={handleMedicationFromAlgorithm}
          lang={lang}
        />
      )}

      {currentTab === 'prescription' && (
        <PrescriptionWriter
          medicines={mockMedicines}
          patientName={patientData.name || 'Patient'}
          patientAge={patientData.age}
          lang={lang}
        />
      )}
    </div>
  );
```

### 3. Initialize State

Add at the top of Wizard component:
```jsx
const [currentTab, setCurrentTab] = useState('algorithm');
```

---

## Option B: Add as Standalone Route

If you're using React Router:

```jsx
// In your router configuration
import ClinicalToolsDemo from './components/ClinicalToolsDemo';

const routes = [
  { path: '/', element: <App /> },
  { path: '/wizard', element: <Wizard /> },
  { path: '/clinical-tools', element: <ClinicalToolsDemo /> }
];
```

Then add a link in your Sidebar:
```jsx
<Link to="/clinical-tools" className="px-4 py-2 hover:bg-blue-100">
  Clinical Tools
</Link>
```

---

## Option C: Replace Step 7 (If using Existing Algorithm)

If you already have a Step 7 algorithm component, you can replace it:

```jsx
// In Wizard.jsx
case 6: // Step 7 in UI (0-indexed as step 6)
  return (
    <div className="space-y-6">
      <InfertilityWizardV2
        onMedicationAdd={(med) => {
          setPrescriptionMeds([...prescriptionMeds, med]);
        }}
        lang={lang}
      />
    </div>
  );
```

---

## Data Integration Examples

### Using Patient Data from Previous Steps

```jsx
<PrescriptionWriter
  medicines={mockMedicines}
  patientName={patientData.name}
  patientAge={patientData.age}
  patientHistory={patientData}
  lang={lang}
/>
```

### Saving Prescriptions to LocalStorage

```jsx
const handleSavePrescription = (prescription) => {
  const prescriptions = JSON.parse(
    localStorage.getItem('prescriptions') || '[]'
  );
  prescriptions.push({
    patientId: patientData.id,
    medicines: prescription,
    date: new Date().toISOString(),
    doctor: 'Dr. Mohamed Salah'
  });
  localStorage.setItem('prescriptions', JSON.stringify(prescriptions));
};
```

### Connecting to Supabase

```jsx
import { medicineQueries, prescriptionQueries } from '../lib/supabase';

// Fetch medicines
useEffect(() => {
  const loadMedicines = async () => {
    const meds = await medicineQueries.getAll();
    setMedicines(meds);
  };
  loadMedicines();
}, []);

// Save prescription
const savePrescription = async (prescription) => {
  await prescriptionQueries.create({
    patient_id: patientData.id,
    medicines_list: prescription,
    doctor_name: 'Dr. Mohamed Salah',
    clinic_name: 'OB/GYN Clinic',
    notes: ''
  });
};
```

---

## Styling Customization

### Match Existing Theme

If your app uses different colors, customize in the components:

```jsx
// In InfertilityWizardV2.jsx
// Change class names to match your theme
className="bg-teal-600"  // Your primary color
className="border-teal-500"  // Your accent color
```

### Dark Mode Support

Add dark mode classes:
```jsx
<div className="dark:bg-gray-900 dark:text-white">
  {/* Component content */}
</div>
```

---

## TypeScript Support (If Upgrading)

If converting to TypeScript:

```typescript
interface Props {
  medicines: Medicine[];
  patientName: string;
  patientAge: number;
  lang: 'en' | 'ar';
  onSave?: (prescription: Prescription) => void;
}

export default function PrescriptionWriter(props: Props) {
  // Component code
}
```

---

## Testing the Integration

### Checklist

- [ ] Components render without errors
- [ ] Navigation between tabs works
- [ ] Algorithm decision tree functions
- [ ] Medication suggestions appear
- [ ] Add to Prescription button works
- [ ] Medicine search filters correctly
- [ ] Dosage editing works
- [ ] Print button generates PDF
- [ ] Data persists in LocalStorage
- [ ] Arabic text displays correctly
- [ ] Responsive on mobile devices

### Manual Testing Steps

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to wizard:**
   - Go to http://localhost:5173
   - Click on "Clinical Tools" step (or Step 8)

3. **Test Clinical Decision:**
   - Answer questions in the algorithm
   - Verify recommendations appear
   - Click "Add to Prescription"

4. **Test Prescription Writer:**
   - Verify tab switches automatically
   - Search for a medicine
   - Select from dropdown
   - Edit dosage
   - Click Print
   - Verify PDF format

5. **Test Bilingual Support:**
   - Toggle language to Arabic
   - Verify RTL layout
   - Check Arabic dosages

---

## Troubleshooting

### Problem: "Cannot find module InfertilityWizardV2"
**Solution:** Make sure the file path is correct:
```jsx
import InfertilityWizardV2 from './InfertilityWizardV2';  // ✅ Correct
import InfertilityWizard from './InfertilityWizardV2';   // ❌ Wrong
```

### Problem: Medicines not showing in dropdown
**Solution:** Verify the mock medicines array has the correct structure:
```javascript
{
  trade_name: "...",           // Required
  scientific_name: "...",      // Required
  default_dosage: "...",       // Required
  // Other fields
}
```

### Problem: Print button not working
**Solution:** Check browser print settings:
- Allow popups for your site
- Check print preview
- Try different browser

### Problem: Arabic text not displaying
**Solution:** Ensure Tailwind CSS is configured with RTL:
```jsx
<div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
```

---

## Performance Optimization

### Memoize Components

```jsx
import { memo } from 'react';

const MemoizedPrescriptionWriter = memo(PrescriptionWriter);
```

### Lazy Load Components

```jsx
import { lazy, Suspense } from 'react';

const ClinicalTools = lazy(() => import('./components/ClinicalToolsDemo'));

// In render:
<Suspense fallback={<div>Loading...</div>}>
  <ClinicalTools />
</Suspense>
```

---

## Next Steps

1. ✅ Choose your integration option (A, B, or C)
2. ✅ Copy component files to your project
3. ✅ Update imports and exports
4. ✅ Run `npm run dev`
5. ✅ Test thoroughly
6. ✅ Deploy to production

---

**Questions?** Refer to:
- `IMPLEMENTATION_GUIDE.md` for component details
- `README.md` for project overview
- Component source files for implementation details

**Ready to integrate?** Start with Option A for seamless integration! 🚀
