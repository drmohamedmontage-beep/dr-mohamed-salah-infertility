import React, { useState } from 'react'
import StepBasic from './wizard/StepBasic'
import StepMaleFactor from './wizard/StepMaleFactor'
import StepHormones from './wizard/StepHormones'
import StepUterusTubes from './wizard/StepUterusTubes'
import StepReport from './wizard/StepReport'
import StepRecords from './wizard/StepRecords'
import InfertilityWizard from './InfertilityWizard'

export default function Wizard({ lang, currentStep, onStepChange }) {
  const [step, setStep] = useState(0)
  const [prescriptionMeds, setPrescriptionMeds] = useState([])
  const [patientData, setPatientData] = useState({
    basic: {},
    male: {},
    female: {},
    tubal: {},
    uterine: {}
  })

  const activeStep = currentStep !== undefined ? currentStep : step

  const handleStepChange = (newStep) => {
    setStep(newStep)
    onStepChange?.(newStep)
  }

  const handleAddMedicationsFromWizard = (medications) => {
    setPrescriptionMeds(medications)
  }

  const stepTitles = {
    en: ['Basic Info', 'Male Factor', 'Hormones & Ovulation', 'Uterus & Tubes', 'Report & Rx', 'Patient Records', 'Clinical Decision Tool'],
    ar: ['البيانات الأساسية', 'العامل الذكري', 'الهرمونات والتبويض', 'الرحم والأنابيب', 'التقرير والوصفة', 'سجلات المرضى', 'أداة القرار السريري']
  }

  const titles = lang === 'ar' ? stepTitles.ar : stepTitles.en

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-gray-800">{titles[activeStep]}</h2>
        <div className="flex gap-2">
          <button
            disabled={activeStep === 0}
            className="px-4 py-2 bg-gray-400 text-white rounded disabled:opacity-50 hover:bg-gray-500 transition"
            onClick={() => handleStepChange(Math.max(0, activeStep - 1))}
          >
            {lang === 'ar' ? '← السابق' : 'Prev →'}
          </button>
          <button
            disabled={activeStep === 5}
            className="px-4 py-2 bg-[#0ea5e9] text-white rounded disabled:opacity-50 hover:bg-blue-600 transition"
            onClick={() => handleStepChange(Math.min(5, activeStep + 1))}
          >
            {lang === 'ar' ? 'التالي →' : '← Next'}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6 flex gap-1">
        {titles.map((_, idx) => (
          <div
            key={idx}
            className={`flex-1 h-2 rounded transition ${
              idx <= activeStep ? 'bg-[#0f766e]' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        {activeStep === 0 && <StepBasic lang={lang} />}
        {activeStep === 1 && <StepMaleFactor lang={lang} />}
        {activeStep === 2 && <StepHormones lang={lang} />}
        {activeStep === 3 && <StepUterusTubes lang={lang} />}
        {activeStep === 4 && <StepReport lang={lang} patientData={patientData} suggestedMeds={prescriptionMeds} />}
        {activeStep === 5 && <StepRecords lang={lang} />}
        {activeStep === 6 && <InfertilityWizard lang={lang} onAddMedications={handleAddMedicationsFromWizard} />}
      </div>
    </div>
  )
}
