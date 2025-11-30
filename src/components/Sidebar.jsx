import React from 'react'
import { Stethoscope, LogOut } from 'lucide-react'

const stepsEN = ['Basic Info', 'Male Factor', 'Hormones & Ovulation', 'Uterus & Tubes', 'Report & Rx', 'Patient Records', 'Clinical Decision Tool']
const stepsAR = ['البيانات الأساسية', 'العامل الذكري', 'الهرمونات والتبويض', 'الرحم والأنابيب', 'التقرير والوصفة', 'سجلات المرضى', 'أداة القرار السريري']

export default function Sidebar({ lang, setLang, currentStep, onStepClick, onLogout }) {
  const steps = lang === 'ar' ? stepsAR : stepsEN

  return (
    <aside className="w-64 bg-gradient-to-b from-[#e6fffb] to-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Stethoscope size={24} className="text-[#0f766e]" />
          <div>
            <h1 className="text-sm font-semibold">{lang === 'ar' ? 'د. محمد صلاح' : 'Dr. Mohamed Salah'}</h1>
            <p className="text-xs text-gray-600">{lang === 'ar' ? 'عيادة الخصوبة' : 'Fertility Clinic'}</p>
          </div>
        </div>

        {/* Language Toggle */}
        <button
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          className="w-full px-3 py-1 bg-[#0f766e] text-white rounded text-sm font-medium hover:bg-teal-700 transition"
        >
          {lang === 'en' ? '🇸🇦 العربية' : '🇬🇧 English'}
        </button>
      </div>

      {/* Steps Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <p className="text-xs text-gray-500 font-semibold uppercase mb-3">
          {lang === 'ar' ? 'خطوات التشخيص' : 'Diagnostic Steps'}
        </p>
        <div className="space-y-1">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => onStepClick?.(idx)}
              className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                idx === currentStep
                  ? 'bg-[#0f766e] text-white font-medium'
                  : 'text-gray-700 hover:bg-[#ecfdfa]'
              }`}
            >
              <span className="inline-block w-6 h-6 bg-opacity-50 rounded text-xs flex items-center justify-center mr-2">
                {idx + 1}
              </span>
              {step}
            </button>
          ))}
        </div>
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        <p className="text-xs text-gray-600">
          {lang === 'ar'
            ? 'نظام دعم القرار السريري لعلاج العقم'
            : 'Infertility CDSS based on WHO 2021, RCOG & NICE guidelines'}
        </p>
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm font-medium"
          >
            <LogOut size={16} />
            {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
          </button>
        )}
      </div>
    </aside>
  )
}
