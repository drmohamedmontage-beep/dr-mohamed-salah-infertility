import React, { useState } from 'react'
import { Info } from 'lucide-react'

export default function StepBasic({ lang }) {
  const [form, setForm] = useState({ name: '', age: '', weight: '', height: '', duration: '', type: 'Primary' })

  const bmi = form.weight && form.height ? (form.weight / ((form.height / 100) ** 2)).toFixed(1) : '-'

  return (
    <form className="space-y-6">
      {/* Patient Name */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          {lang === 'ar' ? '👤 الاسم الكامل' : '👤 Full Name'}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder={lang === 'ar' ? 'أدخل اسم المريضة' : 'Enter patient name'}
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-[#0f766e]"
        />
      </div>

      {/* Basic Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2">
            {lang === 'ar' ? '📅 العمر (سنة)' : '📅 Age (years)'}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="number"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            placeholder="25"
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-[#0f766e]"
          />
          <p className="text-xs text-gray-500 mt-1">
            {lang === 'ar' ? 'المرأة <35 سنة لها احتياطي مبيض أفضل' : 'Women <35 yrs have better ovarian reserve'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            {lang === 'ar' ? '⚖️ الوزن (كغ)' : '⚖️ Weight (kg)'}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="number"
            step="0.1"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            placeholder="70"
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-[#0f766e]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            {lang === 'ar' ? '📏 الطول (سم)' : '📏 Height (cm)'}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="number"
            value={form.height}
            onChange={(e) => setForm({ ...form, height: e.target.value })}
            placeholder="165"
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-[#0f766e]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            {lang === 'ar' ? '📊 BMI' : '📊 BMI'}
          </label>
          <div className="w-full border border-gray-300 rounded p-2 bg-gray-100 text-gray-700 font-medium">
            {bmi}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {bmi !== '-' &&
              (bmi < 18.5
                ? lang === 'ar'
                  ? 'نقص الوزن'
                  : 'Underweight'
                : bmi < 25
                  ? lang === 'ar'
                    ? 'وزن طبيعي'
                    : 'Normal'
                  : bmi < 30
                    ? lang === 'ar'
                      ? 'زيادة في الوزن'
                      : 'Overweight'
                    : lang === 'ar'
                      ? 'السمنة'
                      : 'Obese')}
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            {lang === 'ar' ? '⏳ مدة العقم (أشهر)' : '⏳ Duration of Infertility (months)'}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="number"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            placeholder="12"
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-[#0f766e]"
          />
          <p className="text-xs text-gray-500 mt-1">
            {lang === 'ar' ? 'تعريف WHO: > 12 شهر من محاولات الحمل الفاشلة' : 'WHO Definition: >12 months unprotected intercourse'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            {lang === 'ar' ? '🔄 نوع العقم' : '🔄 Type of Infertility'}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-[#0f766e]"
          >
            <option value="Primary">{lang === 'ar' ? 'أساسي (لم تحمل أبداً)' : 'Primary (Never pregnant)'}</option>
            <option value="Secondary">
              {lang === 'ar' ? 'ثانوي (حمل سابق)' : 'Secondary (Prior pregnancy)'}
            </option>
          </select>
        </div>
      </div>

      {/* Medical Guidelines Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded flex gap-3">
        <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <strong>{lang === 'ar' ? 'المراجع الطبية:' : 'Medical References:'}</strong>
          <ul className="mt-2 list-disc list-inside space-y-1 text-xs">
            <li>WHO 2021 Guidelines for diagnosis of infertility</li>
            <li>RCOG, NICE & ASRM recommendations for initial assessment</li>
            <li>{lang === 'ar' ? 'BMI يؤثر على نتائج العقم والحمل' : 'BMI affects fertility outcomes'}</li>
          </ul>
        </div>
      </div>
    </form>
  )
}
