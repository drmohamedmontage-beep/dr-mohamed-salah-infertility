import React, { useState } from 'react';
import { Stethoscope, Repeat, Plus } from 'lucide-react';

const algorithmSteps = {
  start: {
    id: 'start',
    question: 'Couple with 12 months of infertility - Begin Evaluation',
    options: [
      { text: 'Start Assessment', nextStep: 'maleEvaluation' }
    ]
  },
  maleEvaluation: {
    id: 'maleEvaluation',
    question: 'Semen Analysis Result?',
    options: [
      { text: 'Normal', nextStep: 'femaleEvaluation' },
      { text: 'Abnormal', nextStep: 'maleInfertility' }
    ]
  },
  maleInfertility: {
    id: 'maleInfertility',
    conclusion: 'Abnormal Semen Analysis - Refer to Male Fertility Specialist',
    color: 'blue'
  },
  femaleEvaluation: {
    id: 'femaleEvaluation',
    question: 'Day 21 Progesterone Level?',
    options: [
      { text: '< 5 ng/mL (No Ovulation)', nextStep: 'noOvulation' },
      { text: '≥ 5 ng/mL (Ovulation Confirmed)', nextStep: 'ovulationConfirmed' }
    ]
  },
  noOvulation: {
    id: 'noOvulation',
    question: 'No Ovulation Detected - Next Steps:',
    options: [
      { text: 'Check TSH, Prolactin, FSH, Estradiol', nextStep: 'anovulationWorkup' }
    ]
  },
  anovulationWorkup: {
    id: 'anovulationWorkup',
    conclusion: 'Diagnose and Treat Underlying Causes (PCOS, Thyroid, Hyperprolactinemia, etc.)',
    color: 'yellow',
    recommendation: {
      trade_name: 'Clomid',
      dosage: 'قرص مرتين يومياً من اليوم الثاني للدورة لمدة 5 أيام',
      reason: 'Ovulation Induction for Anovulation'
    }
  },
  ovulationConfirmed: {
    id: 'ovulationConfirmed',
    question: 'Ovulation Confirmed - Assess for Tubal/Uterine Pathology:',
    options: [
      { text: 'HSG/Laparoscopy Normal', nextStep: 'unexplainedInfertility' },
      { text: 'Tubal Blockage Detected', nextStep: 'tubalBlockage' }
    ]
  },
  tubalBlockage: {
    id: 'tubalBlockage',
    conclusion: 'Tubal Blockage - Refer for Surgical Correction or IVF',
    color: 'blue'
  },
  unexplainedInfertility: {
    id: 'unexplainedInfertility',
    conclusion: 'Unexplained Infertility - Consider IUI or IVF Referral',
    color: 'green',
    recommendation: {
      trade_name: 'Duphaston',
      dosage: 'قرص مرتين يومياً',
      reason: 'Luteal Support'
    }
  }
};

export default function InfertilityWizard({ onMedicationAdd, lang = 'en' }) {
  const [currentStep, setCurrentStep] = useState('start');
  const [history, setHistory] = useState(['start']);

  const step = algorithmSteps[currentStep];

  const handleNext = (nextStepId) => {
    setHistory([...history, nextStepId]);
    setCurrentStep(nextStepId);
  };

  const handleReset = () => {
    setCurrentStep('start');
    setHistory(['start']);
  };

  const handleAddMedication = () => {
    if (step.recommendation && onMedicationAdd) {
      onMedicationAdd(step.recommendation);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-blue-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-blue-300">
        <div className="flex items-center gap-3">
          <Stethoscope className="text-blue-600" size={32} />
          <h1 className="text-2xl font-bold text-gray-800">Clinical Decision Support</h1>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition"
        >
          <Repeat size={16} />
          Reset
        </button>
      </div>

      {/* Breadcrumb */}
      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        {history.map((stepId, idx) => (
          <div key={idx} className="flex items-center">
            {idx > 0 && <span className="mx-1">→</span>}
            <span className={`px-2 py-1 rounded ${stepId === currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
              {algorithmSteps[stepId].id}
            </span>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 bg-gray-50 rounded-lg">
        {step.question && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{step.question}</h2>
            <div className="flex flex-col gap-3">
              {step.options?.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNext(option.nextStep)}
                  className="w-full px-4 py-3 text-left bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {step.conclusion && (
          <div className={`p-6 rounded-lg border-l-4 ${
            step.color === 'blue'
              ? 'bg-blue-50 border-blue-500'
              : step.color === 'green'
                ? 'bg-green-50 border-green-500'
                : 'bg-yellow-50 border-yellow-500'
          }`}>
            <p className={`text-lg font-semibold ${
              step.color === 'blue'
                ? 'text-blue-900'
                : step.color === 'green'
                  ? 'text-green-900'
                  : 'text-yellow-900'
            }`}>
              {step.conclusion}
            </p>

            {step.recommendation && (
              <div className="mt-4 p-4 bg-white rounded border border-blue-200">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Recommended Medication:</strong>
                </p>
                <p className="font-semibold text-gray-800">{step.recommendation.trade_name}</p>
                <p className="text-sm text-gray-700 my-2">{step.recommendation.dosage}</p>
                <p className="text-xs text-gray-500 mb-3">{step.recommendation.reason}</p>
                <button
                  onClick={handleAddMedication}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  <Plus size={16} />
                  Add to Prescription
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
