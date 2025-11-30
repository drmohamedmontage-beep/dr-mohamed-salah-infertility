import React, { useState } from 'react'
import { AlertTriangle, CheckCircle, Plus, Trash2 } from 'lucide-react'

// Drug database
const drugDatabase = {
  Induction: [
    { name: 'Clomid (Clomiphene)', dose: '50-100 mg daily, days 3-7', category: 'Oral', indication: 'PCOS, Anovulation' },
    { name: 'Letrozole (Femara)', dose: '2.5-5 mg daily, days 3-7', category: 'Oral', indication: 'PCOS, resistance to Clomid' },
    { name: 'Metformin', dose: '500-1000 mg TDS', category: 'Oral', indication: 'PCOS, insulin resistance' }
  ],
  IVF: [
    { name: 'Gonal-F (FSH)', dose: '150-300 IU daily SC', category: 'Injectable', indication: 'IVF stimulation' },
    { name: 'Menopur (hMG)', dose: '75-150 IU daily', category: 'Injectable', indication: 'IVF, low responders' },
    { name: 'Cetrotide (GnRH Antagonist)', dose: '0.25 mg daily, from day 5', category: 'Injectable', indication: 'IVF agonist protocol' }
  ],
  Support: [
    { name: 'Cyclogest (Progesterone)', dose: '400 mg BD, from day 21', category: 'Vaginal', indication: 'Luteal support' },
    { name: 'Crinone (Progesterone gel)', dose: '90 mg daily', category: 'Vaginal', indication: 'Luteal support, IVF' },
    { name: 'Aspirin (low-dose)', dose: '75-100 mg daily', category: 'Oral', indication: 'Thrombophilia, recurrent loss' }
  ],
  Supplements: [
    { name: 'CoQ10', dose: '300-600 mg daily', category: 'Supplement', indication: 'Egg quality, DOR' },
    { name: 'DHEA', dose: '25 mg TDS', category: 'Supplement', indication: 'DOR, low AMH' },
    { name: 'Vitamin D3', dose: '2000-4000 IU daily', category: 'Supplement', indication: 'General fertility' },
    { name: 'Prenatal Vitamins', dose: '1 tablet daily', category: 'Supplement', indication: 'Folic acid, general' }
  ]
}

export default function StepReport({ lang, patientData, suggestedMeds = [] }) {
  const [selectedDrug, setSelectedDrug] = useState('')
  const [prescriptionLines, setPrescriptionLines] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('Induction')

  // Auto-populate suggested medications from Clinical Decision Wizard
  React.useEffect(() => {
    if (suggestedMeds && suggestedMeds.length > 0) {
      const newMeds = suggestedMeds.map((medName) => {
        const allDrugs = Object.values(drugDatabase).flat()
        const drug = allDrugs.find((d) => d.name === medName)
        return {
          id: Date.now() + Math.random(),
          name: drug?.name || medName,
          dose: drug?.dose || 'See clinical guidelines',
          indication: drug?.indication || ''
        }
      })
      setPrescriptionLines(newMeds)
    }
  }, [suggestedMeds])

  // Generate diagnosis based on patient data
  const generateDiagnosis = () => {
    const findings = []

    if (patientData.male?.abnormal) {
      findings.push({
        type: lang === 'ar' ? 'عامل ذكري' : 'Male Factor Infertility',
        severity: 'high',
        action: lang === 'ar' ? 'يجب النظر في IUI أو IVF' : 'Consider IUI or IVF depending on severity'
      })
    }

    if (patientData.female?.pcos) {
      findings.push({
        type: 'PCOS',
        severity: 'medium',
        action: lang === 'ar' ? 'الخط الأول: Letrozole أو Clomid + Metformin' : 'First-line: Letrozole or Clomid + Metformin'
      })
    }

    if (patientData.female?.dor) {
      findings.push({
        type: lang === 'ar' ? 'نقص احتياطي المبيض' : 'Diminished Ovarian Reserve',
        severity: 'high',
        action: lang === 'ar' ? 'تحفيز قوي، DHEA، CoQ10' : 'Aggressive stimulation, DHEA, CoQ10'
      })
    }

    if (findings.length === 0) {
      findings.push({
        type: lang === 'ar' ? 'عقم غير مفسر' : 'Unexplained Infertility',
        severity: 'low',
        action: lang === 'ar' ? 'IVF تجريبي أو ملاحظة + IUI' : 'Empirical IVF or observation + IUI'
      })
    }

    return findings
  }

  const findings = generateDiagnosis()
  const availableDrugs = Object.values(drugDatabase)
    .flat()
    .filter((d) => d.category === categoryFilter)

  const handleDrugSelect = (drug) => {
    setPrescriptionLines([
      ...prescriptionLines,
      {
        id: Date.now(),
        name: drug.name,
        dose: drug.dose,
        indication: drug.indication
      }
    ])
    setSelectedDrug('')
  }

  const removeDrug = (id) => {
    setPrescriptionLines(prescriptionLines.filter((d) => d.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Clinical Decision Alert */}
      {suggestedMeds && suggestedMeds.length > 0 && (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg flex gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <p className="font-semibold text-purple-900">
              {lang === 'ar' ? 'أدوية موصى بها من أداة القرار السريري' : 'Suggested Medications from Clinical Decision Tool'}
            </p>
            <p className="text-sm text-purple-700 mt-1">
              {lang === 'ar' ? 'تم إضافة الأدوية المقترحة تلقائياً أدناه' : 'Suggested medications have been auto-populated below'}
            </p>
          </div>
        </div>
      )}

      {/* Diagnosis Section */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          {lang === 'ar' ? '📋 التشخيص والنتائج' : '📋 Diagnosis & Findings'}
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {findings.map((f, idx) => (
            <div
              key={idx}
              className={`p-3 rounded border-l-4 ${
                f.severity === 'high'
                  ? 'bg-red-50 border-red-500'
                  : f.severity === 'medium'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-green-50 border-green-500'
              }`}
            >
              <strong className="block mb-1">{f.type}</strong>
              <p className="text-sm text-gray-700">{f.action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prescription Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          {lang === 'ar' ? '💊 نظام الوصفات الذكي' : '💊 Smart Prescription System'}
        </h3>

        {/* Drug Selection */}
        <div className="mb-4 p-4 bg-blue-50 rounded border border-blue-200">
          <label className="block text-sm font-medium mb-2">
            {lang === 'ar' ? 'فئة الدواء' : 'Drug Category'}
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-1/2 border rounded p-2 mb-3"
          >
            {Object.keys(drugDatabase).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium mb-2">
            {lang === 'ar' ? 'اختر دواء' : 'Select Drug'}
          </label>
          <div className="flex gap-2 flex-wrap">
            <select
              value={selectedDrug}
              onChange={(e) => setSelectedDrug(e.target.value)}
              className="flex-1 min-w-40 border rounded p-2"
            >
              <option value="">{lang === 'ar' ? '-- اختر --' : '-- Select --'}</option>
              {availableDrugs.map((drug) => (
                <option key={drug.name} value={drug.name}>
                  {drug.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                const drug = availableDrugs.find((d) => d.name === selectedDrug)
                if (drug) handleDrugSelect(drug)
              }}
              disabled={!selectedDrug}
              className="px-4 py-2 bg-[#0ea5e9] text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
            >
              <Plus size={16} />
              {lang === 'ar' ? 'إضافة' : 'Add'}
            </button>
          </div>
        </div>

        {/* Selected Drugs */}
        {prescriptionLines.length > 0 && (
          <div className="mb-4 p-4 bg-green-50 rounded border border-green-200">
            <h4 className="font-semibold mb-3">
              {lang === 'ar' ? 'الأدوية المختارة' : 'Selected Medications'}
            </h4>
            <div className="space-y-2">
              {prescriptionLines.map((drug) => (
                <div key={drug.id} className="flex items-start justify-between p-2 bg-white border rounded">
                  <div className="flex-1">
                    <strong className="block">{drug.name}</strong>
                    <p className="text-sm text-gray-600">{lang === 'ar' ? 'الجرعة: ' : 'Dose: '}{drug.dose}</p>
                    <p className="text-xs text-gray-500">{lang === 'ar' ? 'المؤشر: ' : 'Indication: '}{drug.indication}</p>
                  </div>
                  <button
                    onClick={() => removeDrug(drug.id)}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Print Button */}
      <div className="flex gap-2 justify-end pt-4 border-t print:hidden">
        <button
          onClick={() => window.print()}
          className="px-6 py-2 bg-[#0f766e] text-white rounded font-semibold hover:bg-teal-700 transition"
        >
          {lang === 'ar' ? '🖨️ طباعة' : '🖨️ Print'}
        </button>
      </div>
    </div>
  )
}
