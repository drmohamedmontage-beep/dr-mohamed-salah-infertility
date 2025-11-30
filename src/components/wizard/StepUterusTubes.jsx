import React, { useState } from 'react'
import { AlertCircle } from 'lucide-react'

export default function StepUterusTubes({ lang }) {
  const [form, setForm] = useState({
    tubalPatency: 'Unknown',
    uterineCavity: 'Normal'
  })

  const tubalOptions = {
    en: ['Unknown', 'Bilateral Patent', 'Bilateral Blocked', 'Right Blocked', 'Left Blocked'],
    ar: ['غير معروف', 'ثنائي سالك', 'ثنائي مسدود', 'أيمن مسدود', 'أيسر مسدود']
  }

  const uterineOptions = {
    en: ['Normal', 'Fibroids', 'Polyps', 'Septate Uterus', 'Hypoplastic Uterus', 'Asherman Syndrome'],
    ar: ['طبيعي', 'أورام ليفية', 'سلائل', 'رحم حاجز', 'رحم ناقص النمو', 'متلازمة أشرمان']
  }

  const hints = {
    tubal: lang === 'ar'
      ? 'يتطلب HSG أو لابروسكوبي. العقم الثنائي المسدود يشير إلى الحاجة إلى IVF'
      : 'Requires HSG or Laparoscopy. Bilateral blockage suggests IVF',
    uterine: lang === 'ar'
      ? 'يؤثر على الجودة والقدرة على التطعيم'
      : 'Affects implantation and pregnancy outcomes'
  }

  const requiresIVF = form.tubalPatency === 'Bilateral Blocked' || form.tubalPatency === 'ثنائي مسدود'
  const hasUterinePath = form.uterineCavity !== 'Normal' && form.uterineCavity !== 'طبيعي'

  return (
    <form className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          {lang === 'ar' ? 'سالكية قنوات فالوب' : 'Tubal Patency'}
        </label>
        <select
          value={form.tubalPatency}
          onChange={(e) => setForm({ ...form, tubalPatency: e.target.value })}
          className="w-full md:w-1/2 border rounded p-2"
        >
          {(lang === 'ar' ? tubalOptions.ar : tubalOptions.en).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">{hints.tubal}</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {lang === 'ar' ? 'تجويف الرحم' : 'Uterine Cavity'}
        </label>
        <select
          value={form.uterineCavity}
          onChange={(e) => setForm({ ...form, uterineCavity: e.target.value })}
          className="w-full md:w-1/2 border rounded p-2"
        >
          {(lang === 'ar' ? uterineOptions.ar : uterineOptions.en).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">{hints.uterine}</p>
      </div>

      {requiresIVF && (
        <div className="p-3 bg-red-50 border border-red-200 rounded flex gap-2">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">
            {lang === 'ar'
              ? 'انسداد قنوات فالوب ثنائي: يتطلب IVF (التلقيح الصناعي) كخيار علاجي'
              : 'Bilateral Tubal Blockage: IVF is indicated as primary treatment'}
          </div>
        </div>
      )}

      {hasUterinePath && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded flex gap-2">
          <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-700">
            {lang === 'ar'
              ? 'تشوه أو مسار رحمي: قد يتطلب تقويم جراحي قبل المحاولات الإنجابية'
              : 'Uterine pathology detected: may require surgical correction before conception'}
          </div>
        </div>
      )}
    </form>
  )
}
