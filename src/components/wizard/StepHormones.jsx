import React, { useState } from 'react'
import { AlertCircle, Info } from 'lucide-react'

export default function StepHormones({ lang }) {
  const [form, setForm] = useState({
    fsh: '',
    lh: '',
    e2: '',
    amh: '',
    tsh: '',
    prolactin: '',
    progesterone: '',
    afc: '',
    cycleRegular: 'yes'
  })

  const hints = {
    fsh: lang === 'ar' ? 'FSH الطبيعي (يوم 3): 3-12 mIU/mL' : 'FSH Normal (Day 3): 3-12 mIU/mL',
    lh: lang === 'ar' ? 'LH الطبيعي (يوم 3): 2-12 mIU/mL' : 'LH Normal (Day 3): 2-12 mIU/mL',
    e2: lang === 'ar' ? 'E2 الطبيعي (يوم 3): < 50 pg/mL' : 'E2 Normal (Day 3): <50 pg/mL',
    amh: lang === 'ar' ? 'AMH الطبيعي: > 1 ng/mL' : 'AMH Normal: >1 ng/mL',
    tsh: lang === 'ar' ? 'TSH الطبيعي: 0.4-4 mIU/mL' : 'TSH Normal: 0.4-4 mIU/mL',
    prolactin: lang === 'ar' ? 'Prolactin الطبيعي: < 25 ng/mL' : 'Prolactin Normal: <25 ng/mL',
    progesterone: lang === 'ar' ? 'Progesterone (يوم 21): > 12 ng/mL يشير إلى إباضة' : 'Progesterone (Day 21): >12 ng/mL suggests ovulation',
    afc: lang === 'ar' ? 'عدد الجريبات المرئية' : 'Antral Follicle Count'
  }

  // PCOS detection: irregular cycles + elevated androgen + PCO morphology or high AMH
  const isPcos = form.cycleRegular === 'no' && (
    (form.amh && parseFloat(form.amh) > 3.5) || 
    (form.lh && form.fsh && parseFloat(form.lh) / parseFloat(form.fsh) > 3)
  )

  // DOR detection: High FSH or Low AMH
  const isDor = (form.fsh && parseFloat(form.fsh) > 12) || (form.amh && parseFloat(form.amh) < 1)

  // Thyroid/Prolactin issues
  const thyroidIssue = form.tsh && (parseFloat(form.tsh) < 0.4 || parseFloat(form.tsh) > 4)
  const prolactinIssue = form.prolactin && parseFloat(form.prolactin) > 25

  const issues = []
  if (isPcos) issues.push(lang === 'ar' ? 'PCOS المشبوهة' : 'Suspected PCOS')
  if (isDor) issues.push(lang === 'ar' ? 'نقص احتياطي المبيض' : 'Diminished Ovarian Reserve')
  if (thyroidIssue) issues.push(lang === 'ar' ? 'خلل في الغدة الدرقية' : 'Thyroid Disorder')
  if (prolactinIssue) issues.push(lang === 'ar' ? 'ارتفاع Prolactin' : 'Elevated Prolactin')
  if (form.progesterone && parseFloat(form.progesterone) < 12) issues.push(lang === 'ar' ? 'قد لا يوجد إباضة' : 'Possible Anovulation')

  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          {lang === 'ar' ? 'انتظام الدورة الشهرية' : 'Cycle Regularity'}
        </label>
        <select
          value={form.cycleRegular}
          onChange={(e) => setForm({ ...form, cycleRegular: e.target.value })}
          className="w-full md:w-1/3 border rounded p-2"
        >
          <option value="yes">{lang === 'ar' ? 'منتظمة' : 'Regular'}</option>
          <option value="no">{lang === 'ar' ? 'غير منتظمة' : 'Irregular'}</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">
            {lang === 'ar' ? 'FSH (mIU/mL)' : 'FSH (mIU/mL)'}
          </label>
          <input
            type="number"
            step="0.1"
            value={form.fsh}
            onChange={(e) => setForm({ ...form, fsh: e.target.value })}
            className="mt-1 block w-full border rounded p-2"
          />
          <p className="text-xs text-gray-500 mt-1">{hints.fsh}</p>
        </div>

        <div>
          <label className="block text-sm font-medium">
            {lang === 'ar' ? 'LH (mIU/mL)' : 'LH (mIU/mL)'}
          </label>
          <input
            type="number"
            step="0.1"
            value={form.lh}
            onChange={(e) => setForm({ ...form, lh: e.target.value })}
            className="mt-1 block w-full border rounded p-2"
          />
          <p className="text-xs text-gray-500 mt-1">{hints.lh}</p>
        </div>

        <div>
          <label className="block text-sm font-medium">
            {lang === 'ar' ? 'E2 (pg/mL) - يوم 3' : 'E2 (pg/mL) - Day 3'}
          </label>
          <input
            type="number"
            step="0.1"
            value={form.e2}
            onChange={(e) => setForm({ ...form, e2: e.target.value })}
            className="mt-1 block w-full border rounded p-2"
          />
          <p className="text-xs text-gray-500 mt-1">{hints.e2}</p>
        </div>

        <div>
          <label className="block text-sm font-medium">
            {lang === 'ar' ? 'AMH (ng/mL)' : 'AMH (ng/mL)'}
          </label>
          <input
            type="number"
            step="0.1"
            value={form.amh}
            onChange={(e) => setForm({ ...form, amh: e.target.value })}
            className="mt-1 block w-full border rounded p-2"
          />
          <p className="text-xs text-gray-500 mt-1">{hints.amh}</p>
        </div>

        <div>
          <label className="block text-sm font-medium">
            {lang === 'ar' ? 'TSH (mIU/mL)' : 'TSH (mIU/mL)'}
          </label>
          <input
            type="number"
            step="0.01"
            value={form.tsh}
            onChange={(e) => setForm({ ...form, tsh: e.target.value })}
            className="mt-1 block w-full border rounded p-2"
          />
          <p className="text-xs text-gray-500 mt-1">{hints.tsh}</p>
        </div>

        <div>
          <label className="block text-sm font-medium">
            {lang === 'ar' ? 'Prolactin (ng/mL)' : 'Prolactin (ng/mL)'}
          </label>
          <input
            type="number"
            step="0.1"
            value={form.prolactin}
            onChange={(e) => setForm({ ...form, prolactin: e.target.value })}
            className="mt-1 block w-full border rounded p-2"
          />
          <p className="text-xs text-gray-500 mt-1">{hints.prolactin}</p>
        </div>

        <div>
          <label className="block text-sm font-medium">
            {lang === 'ar' ? 'Progesterone (ng/mL) - يوم 21' : 'Progesterone (ng/mL) - Day 21'}
          </label>
          <input
            type="number"
            step="0.1"
            value={form.progesterone}
            onChange={(e) => setForm({ ...form, progesterone: e.target.value })}
            className="mt-1 block w-full border rounded p-2"
          />
          <p className="text-xs text-gray-500 mt-1">{hints.progesterone}</p>
        </div>

        <div>
          <label className="block text-sm font-medium">
            {lang === 'ar' ? 'AFC (عدد الجريبات)' : 'AFC (Antral Follicles)'}
          </label>
          <input
            type="number"
            value={form.afc}
            onChange={(e) => setForm({ ...form, afc: e.target.value })}
            className="mt-1 block w-full border rounded p-2"
          />
          <p className="text-xs text-gray-500 mt-1">{hints.afc}</p>
        </div>
      </div>

      {issues.length > 0 && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded flex gap-2">
          <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-700">
            <strong>{lang === 'ar' ? 'الحالات المشبوهة:' : 'Suspected Conditions:'}</strong>
            <ul className="mt-1 list-disc list-inside">{issues.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
          </div>
        </div>
      )}
    </form>
  )
}
