import React, { useState } from 'react'
import { AlertCircle } from 'lucide-react'

export default function StepMaleFactor({ lang }) {
  const [form, setForm] = useState({
    count: '',
    motility: '',
    morphology: '',
    pusCells: ''
  })

  const hints = {
    count: lang === 'ar' ? 'الحد الأدنى WHO 2021: 15 مليون/مل' : 'WHO 2021 Lower Limit: 15M/mL',
    motility: lang === 'ar' ? 'الحد الأدنى WHO 2021: 40% حركة إجمالية' : 'WHO 2021 Lower Limit: 40% total motility',
    morphology: lang === 'ar' ? 'الحد الأدنى WHO 2021: 4% شكل طبيعي' : 'WHO 2021 Lower Limit: 4% normal forms',
    pusCells: lang === 'ar' ? 'قيمة طبيعية: < 1 مليون/مل (التهاب الخصية)' : 'Normal: <1M/mL (Leukocytospermia if >1M)'
  }

  const flags = {
    count: form.count && parseInt(form.count) < 15,
    motility: form.motility && parseInt(form.motility) < 40,
    morphology: form.morphology && parseInt(form.morphology) < 4,
    pusCells: form.pusCells && parseInt(form.pusCells) > 1
  }

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium flex items-center gap-2">
          {lang === 'ar' ? 'عدد الحيوانات المنوية (مليون/مل)' : 'Sperm Count (M/mL)'}
          {flags.count && <AlertCircle size={16} className="text-red-600" />}
        </label>
        <input
          type="number"
          value={form.count}
          onChange={(e) => setForm({ ...form, count: e.target.value })}
          className="mt-1 block w-full border rounded p-2"
          placeholder="15"
        />
        <p className="text-xs text-gray-500 mt-1">{hints.count}</p>
      </div>

      <div>
        <label className="block text-sm font-medium flex items-center gap-2">
          {lang === 'ar' ? 'الحركة (%)' : 'Motility (%)'}
          {flags.motility && <AlertCircle size={16} className="text-red-600" />}
        </label>
        <input
          type="number"
          value={form.motility}
          onChange={(e) => setForm({ ...form, motility: e.target.value })}
          className="mt-1 block w-full border rounded p-2"
          placeholder="40"
        />
        <p className="text-xs text-gray-500 mt-1">{hints.motility}</p>
      </div>

      <div>
        <label className="block text-sm font-medium flex items-center gap-2">
          {lang === 'ar' ? 'الشكل الطبيعي (%)' : 'Morphology (%)'}
          {flags.morphology && <AlertCircle size={16} className="text-red-600" />}
        </label>
        <input
          type="number"
          value={form.morphology}
          onChange={(e) => setForm({ ...form, morphology: e.target.value })}
          className="mt-1 block w-full border rounded p-2"
          placeholder="4"
        />
        <p className="text-xs text-gray-500 mt-1">{hints.morphology}</p>
      </div>

      <div>
        <label className="block text-sm font-medium flex items-center gap-2">
          {lang === 'ar' ? 'خلايا صديد (مليون/مل)' : 'Pus Cells (M/mL)'}
          {flags.pusCells && <AlertCircle size={16} className="text-red-600" />}
        </label>
        <input
          type="number"
          value={form.pusCells}
          onChange={(e) => setForm({ ...form, pusCells: e.target.value })}
          className="mt-1 block w-full border rounded p-2"
          placeholder="1"
        />
        <p className="text-xs text-gray-500 mt-1">{hints.pusCells}</p>
      </div>

      {Object.values(flags).some(Boolean) && (
        <div className="md:col-span-2 p-3 bg-red-50 border border-red-200 rounded flex gap-2">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">
            {lang === 'ar'
              ? 'تم تحديد قيم خارج النطاق الطبيعي. قد يشير إلى عامل ذكري.'
              : 'Abnormal values detected. May indicate Male Factor Infertility.'}
          </div>
        </div>
      )}
    </form>
  )
}
