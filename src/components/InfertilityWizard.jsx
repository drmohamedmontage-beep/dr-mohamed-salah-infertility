'use client'
import React, { useState } from 'react';
import { Stethoscope, Repeat, Plus } from 'lucide-react';

// Drug recommendations based on diagnosis
const drugRecommendations = {
  en: {
    maleInfertility: {
      drugs: ['IUI Support', 'Vitamin D3', 'CoQ10'],
      note: 'Consider IUI or refer to male fertility specialist'
    },
    anovulation: {
      drugs: ['Clomid (Clomiphene)', 'Letrozole (Femara)', 'Metformin'],
      note: 'Treat underlying cause first, then consider ovulation induction'
    },
    ovulationConfirmed: {
      drugs: ['Cyclogest (Progesterone)', 'Vitamin D3', 'Prenatal Vitamins'],
      note: 'Assess for tubal/uterine pathology'
    },
    art: {
      drugs: ['Gonal-F (FSH)', 'Menopur (hMG)', 'Cetrotide (GnRH Antagonist)', 'Crinone (Progesterone gel)'],
      note: 'Refer to ART specialist for IVF protocol'
    }
  },
  ar: {
    maleInfertility: {
      drugs: ['دعم IUI', 'فيتامين D3', 'CoQ10'],
      note: 'قد تحتاج إلى IUI أو الإحالة إلى متخصص الخصوبة الذكرية'
    },
    anovulation: {
      drugs: ['كلوميد (كلوميفين)', 'ليتروزول (فيمارا)', 'ميتفورمين'],
      note: 'عالج السبب الأساسي أولاً، ثم فكر في حث الإباضة'
    },
    ovulationConfirmed: {
      drugs: ['سيكلوجست (بروجسترون)', 'فيتامين D3', 'فيتامينات ما قبل الولادة'],
      note: 'قيّم وجود أمراض الأنابيب والرحم'
    },
    art: {
      drugs: ['جونال-إف (FSH)', 'مينوبور (hMG)', 'سيتروتايد (GnRH Antagonist)', 'كرينون (جل البروجسترون)'],
      note: 'الإحالة إلى متخصص ART لبروتوكول التلقيح الصناعي'
    }
  }
};

const InfertilityWizard = ({ lang = 'en', onAddMedications = null }) => {
  const [step, setStep] = useState('start');
  const [selectedMeds, setSelectedMeds] = useState([]);

  const algorithmEN = {
    start: {
      question: "Is the couple experiencing infertility for 12 months?",
      options: [
        { text: "Yes, proceed", nextStep: 'maleEvaluation' }
      ]
    },
    maleEvaluation: {
      question: "What is the Semen Analysis Result?",
      options: [
        { text: "Normal", nextStep: 'femaleEvaluation' },
        { text: "Abnormal", nextStep: 'referToSpecialist' }
      ]
    },
    femaleEvaluation: {
      question: "What is the Day 21 Progesterone Level?",
      options: [
        { text: "< 5 ng/mL (No Ovulation)", nextStep: 'noOvulation' },
        { text: "≥ 5 ng/mL (Ovulation Confirmed)", nextStep: 'ovulationConfirmed' }
      ]
    },
    referToSpecialist: {
      conclusion: "Refer to a male fertility specialist for further evaluation.",
      color: "blue",
      recommendation: 'maleInfertility'
    },
    noOvulation: {
      question: "Proceeding with anovulation workup...",
      options: [
        { text: "Check TSH, Prolactin, FSH, Estradiol", nextStep: 'treatUnderlyingCauses' }
      ]
    },
    treatUnderlyingCauses: {
      question: "Were underlying causes identified and treated?",
      options: [
        { text: "Yes, proceed", nextStep: 'considerInduction' }
      ]
    },
    considerInduction: {
      conclusion: "Consider Ovulation Induction (e.g., Clomid) and assess the need for Assisted Reproductive Technology (ART).",
      color: "green",
      recommendation: 'anovulation'
    },
    ovulationConfirmed: {
      question: "Assess for tubal patency and uterine abnormalities (HSG or Laparoscopy).",
      options: [
        { text: "Abnormalities Found", nextStep: 'surgicalCorrection' },
        { text: "Normal/Corrected", nextStep: 'assessART' }
      ]
    },
    surgicalCorrection: {
      question: "Were obstructions or adhesions surgically corrected?",
      options: [
        { text: "Yes, proceed to assess ART", nextStep: 'assessART' }
      ]
    },
    assessART: {
      conclusion: "Assess the need for Assisted Reproductive Technology (ART) referral.",
      color: "green",
      recommendation: 'art'
    }
  };

  const algorithmAR = {
    start: {
      question: "هل الزوجان يعانيان من العقم لمدة 12 شهراً؟",
      options: [
        { text: "نعم، تابع", nextStep: 'maleEvaluation' }
      ]
    },
    maleEvaluation: {
      question: "ما هي نتيجة تحليل السائل المنوي؟",
      options: [
        { text: "طبيعي", nextStep: 'femaleEvaluation' },
        { text: "غير طبيعي", nextStep: 'referToSpecialist' }
      ]
    },
    femaleEvaluation: {
      question: "ما هو مستوى البروجسترون في اليوم 21؟",
      options: [
        { text: "< 5 نانوجرام/مل (بدون إباضة)", nextStep: 'noOvulation' },
        { text: "≥ 5 نانوجرام/مل (إباضة مؤكدة)", nextStep: 'ovulationConfirmed' }
      ]
    },
    referToSpecialist: {
      conclusion: "الإحالة إلى متخصص في الخصوبة الذكرية لمزيد من التقييم.",
      color: "blue",
      recommendation: 'maleInfertility'
    },
    noOvulation: {
      question: "المتابعة مع تقييم عدم الإباضة...",
      options: [
        { text: "فحص TSH والبرولاكتين و FSH و Estradiol", nextStep: 'treatUnderlyingCauses' }
      ]
    },
    treatUnderlyingCauses: {
      question: "هل تم تحديد الأسباب الأساسية وعلاجها؟",
      options: [
        { text: "نعم، تابع", nextStep: 'considerInduction' }
      ]
    },
    considerInduction: {
      conclusion: "فكر في حث الإباضة (مثل كلوميد) وقيّم الحاجة إلى تقنيات الإنجاب المساعدة (ART).",
      color: "green",
      recommendation: 'anovulation'
    },
    ovulationConfirmed: {
      question: "قيّم سالكية الأنابيب والتشوهات الرحمية (HSG أو تنظير البطن).",
      options: [
        { text: "وجدت تشوهات", nextStep: 'surgicalCorrection' },
        { text: "طبيعي/تم تصحيحه", nextStep: 'assessART' }
      ]
    },
    surgicalCorrection: {
      question: "هل تم تصحيح الانسدادات أو الالتصاقات جراحياً؟",
      options: [
        { text: "نعم، تابع لتقييم ART", nextStep: 'assessART' }
      ]
    },
    assessART: {
      conclusion: "قيّم الحاجة للإحالة إلى تقنيات الإنجاب المساعدة (ART).",
      color: "green",
      recommendation: 'art'
    }
  };

  const algorithm = lang === 'ar' ? algorithmAR : algorithmEN;
  const currentStep = algorithm[step];
  const recommendations = lang === 'ar' ? drugRecommendations.ar : drugRecommendations.en;

  const handleOptionClick = (nextStep) => {
    setStep(nextStep);
  };

  const handleReset = () => {
    setStep('start');
    setSelectedMeds([]);
  };

  const handleAddMedications = () => {
    if (currentStep.recommendation && recommendations[currentStep.recommendation]) {
      const meds = recommendations[currentStep.recommendation].drugs;
      setSelectedMeds(meds);
      if (onAddMedications) {
        onAddMedications(meds);
      }
    }
  };

  const labels = {
    en: {
      title: "Clinical Decision Support Tool",
      reset: "Reset",
      addMeds: "Add Recommended Medications",
      recommendedDrugs: "Recommended Medications:",
      note: "Note:"
    },
    ar: {
      title: "أداة دعم القرار السريري",
      reset: "إعادة تعيين",
      addMeds: "إضافة الأدوية الموصى بها",
      recommendedDrugs: "الأدوية الموصى بها:",
      note: "ملاحظة:"
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center gap-3">
          <Stethoscope className="text-teal-600" size={28} />
          <h1 className="text-2xl font-bold text-gray-800">{labels[lang].title}</h1>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          <Repeat size={16} />
          {labels[lang].reset}
        </button>
      </div>

      <div className="p-4 bg-gray-50 rounded-md">
        {currentStep.question && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">{currentStep.question}</h2>
            <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
              {currentStep.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option.nextStep)}
                  className="px-6 py-3 text-lg font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-transform transform hover:scale-105 shadow-md"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep.conclusion && (
          <div>
            <div className={`p-6 rounded-lg text-center mb-4 ${
              currentStep.color === 'blue' ? 'bg-blue-100 border-blue-500' : 'bg-green-100 border-green-500'
            } border-l-4`}>
              <p className={`text-xl font-semibold ${
                currentStep.color === 'blue' ? 'text-blue-800' : 'text-green-800'
              }`}>
                {currentStep.conclusion}
              </p>
            </div>

            {currentStep.recommendation && recommendations[currentStep.recommendation] && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-900 mb-2">{labels[lang].recommendedDrugs}</h3>
                <ul className="list-disc list-inside text-sm text-yellow-800 mb-3">
                  {recommendations[currentStep.recommendation].drugs.map((drug, idx) => (
                    <li key={idx}>{drug}</li>
                  ))}
                </ul>
                <p className="text-xs text-yellow-700 mb-3"><strong>{labels[lang].note}</strong> {recommendations[currentStep.recommendation].note}</p>
                <button
                  onClick={handleAddMedications}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors text-sm font-medium"
                >
                  <Plus size={16} />
                  {labels[lang].addMeds}
                </button>
              </div>
            )}

            {selectedMeds.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-300 rounded-lg">
                <p className="text-sm text-green-700 font-medium">✓ {lang === 'ar' ? 'تمت إضافة الأدوية بنجاح' : 'Medications added successfully'}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InfertilityWizard;
