# 🏥 Infertility CDSS - Development Guide

## Running the Application

### Start Development Server
```powershell
npm run dev
```
Access the app at: **http://localhost:5173**

### Build for Production
```powershell
npm run build
```

---

## 📂 Project Structure

```
src/
├── main.jsx                 # Entry point
├── App.jsx                  # Main app wrapper (RTL/LTR, Sidebar)
├── index.css               # Tailwind + print styles
├── components/
│   ├── Sidebar.jsx         # Navigation + language toggle
│   ├── Wizard.jsx          # Step controller & progress bar
│   └── wizard/
│       ├── StepBasic.jsx   # Patient demographics (with BMI calc)
│       ├── StepMaleFactor.jsx    # WHO 2021 semen analysis
│       ├── StepHormones.jsx      # PCOS/DOR detection logic
│       ├── StepUterusTubes.jsx   # Tubal & uterine pathology
│       ├── StepReport.jsx        # Diagnosis engine + Rx system
│       └── StepRecords.jsx       # Patient database (LocalStorage)
```

---

## 🔑 Key Features Explained

### 1. Bilingual Support
- Toggle in Sidebar: **EN ↔️ العربية**
- RTL applied automatically when Arabic selected
- All medical text translated

### 2. WHO 2021 Male Factor Logic (StepMaleFactor.jsx)
```javascript
flags.count = form.count < 15  // Red flag
flags.motility = form.motility < 40
flags.morphology = form.morphology < 4
flags.pusCells = form.pusCells > 1  // Leukocytospermia
```

### 3. PCOS Detection (StepHormones.jsx)
- Rotterdam Criteria: Irregular cycles + High AMH/LH ratio
- Auto-detect when: `form.cycleRegular === 'no' && (AMH > 3.5 || LH/FSH > 3)`

### 4. Smart Prescription System (StepReport.jsx)
- **Drug Database** organized by category: Induction, IVF, Support, Supplements
- Click "Add" to build prescription list
- Print-optimized output

### 5. Patient Records (StepRecords.jsx)
- Saves to `localStorage.patientRecords`
- CRUD operations: Create, View, Delete
- Modal viewer for quick reference

---

## 🎨 Tailwind Color Scheme

- **Primary (Teal):** `#0f766e` - Dr's clinic branding
- **Secondary (Blue):** `#0ea5e9` - Action buttons
- **High Severity:** Red (`#dc2626`)
- **Medium Severity:** Yellow (`#eab308`)
- **Low Severity:** Green (`#16a34a`)

---

## 📱 Responsive Breakpoints

```css
md: /* 768px */ - Progress bar, multi-column forms
lg: /* 1024px */ - Sidebar width optimization
```

Print styles automatically hide sidebar and optimize for A4.

---

## 🖨️ Print Mode

Triggered by:
```javascript
<button onClick={() => window.print()}>Print</button>
```

CSS hides sidebars, buttons, and formats for PDF export.

---

## 💾 LocalStorage Schema

**Key:** `patientRecords`  
**Value:** JSON array of patient objects
```json
{
  "id": 1701432000000,
  "name": "Fatima Ahmed",
  "age": 34,
  "weight": 72,
  "height": 165,
  "type": "Primary",
  "diagnosis": "PCOS + Mild Male Factor",
  "prescription": "Letrozole 5mg + Metformin 1000mg TDS",
  "createdAt": "12/1/2025"
}
```

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| `npm` not recognized | Run terminal with Admin, restart PowerShell |
| RTL text breaks layout | Ensure `dir="rtl"` in root div when lang==='ar' |
| Print button hidden | Check `.print:hidden` classes in Tailwind |
| LocalStorage quota exceeded | Clear old records manually via browser DevTools |

---

## 📊 Medical Logic Reference

### Diagnosis Priority
1. **Male Factor** (count < 15 OR motility < 40 OR morphology < 4)
2. **PCOS** (irregular + high AMH/LH ratio)
3. **DOR** (FSH > 12 OR AMH < 1)
4. **Tubal Blockage** (bilateral → IVF indicated)
5. **Unexplained Infertility** (if none above)

### First-Line Treatments
- PCOS → Letrozole/Clomid + Metformin
- Mild Male → IUI
- Bilateral Tubal → IVF
- DOR → High-dose stimulation + DHEA/CoQ10

---

## 🚀 Deployment

### Build Step
```bash
npm run build
```
Generates optimized `dist/` folder for production.

### Hosting Options
- **Vercel:** `vercel deploy`
- **Netlify:** Drag & drop `dist/` folder
- **Docker:** Create Dockerfile for containerization

---

## 📚 References

- [Tailwind CSS Docs](https://tailwindcss.com/)
- [React Hooks API](https://react.dev/reference/react)
- [Lucide Icons](https://lucide.dev/)
- [WHO 2021 Semen Analysis](https://www.who.int/publications/i/item/9789240030787)
- [Vite Documentation](https://vitejs.dev/)

---

## ✅ Checklist for New Contributors

- [ ] Install dependencies: `npm install`
- [ ] Start dev server: `npm run dev`
- [ ] Test bilingual toggle in Sidebar
- [ ] Verify LocalStorage in DevTools (F12 > Application > LocalStorage)
- [ ] Test print mode (Ctrl+P or Cmd+P)
- [ ] Check mobile responsiveness (DevTools > Device Toolbar)
- [ ] Run `npm run build` before pushing to production

---

**Last Updated:** December 2025  
**Version:** 0.1.0 - Production Ready
