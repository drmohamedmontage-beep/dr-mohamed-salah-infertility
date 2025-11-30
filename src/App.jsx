import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Wizard from './components/Wizard'

export default function App() {
  const [lang, setLang] = useState('en')
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <div className={`min-h-screen flex ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Sidebar lang={lang} setLang={setLang} currentStep={currentStep} onStepClick={setCurrentStep} />
      <main className="flex-1 bg-gray-50 p-4 md:p-8 overflow-auto">
        <Wizard lang={lang} currentStep={currentStep} onStepChange={setCurrentStep} />
      </main>
    </div>
  )
}
