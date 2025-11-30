import React, { useState, useEffect } from 'react'
import { Trash2, Edit2, Eye } from 'lucide-react'

export default function StepRecords({ lang }) {
  const [records, setRecords] = useState([])
  const [modal, setModal] = useState(null)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('patientRecords') || '[]')
    setRecords(saved)
  }, [])

  const deleteRecord = (id) => {
    const updated = records.filter((r) => r.id !== id)
    setRecords(updated)
    localStorage.setItem('patientRecords', JSON.stringify(updated))
  }

  const saveRecord = (record) => {
    const newRecord = {
      ...record,
      id: Date.now(),
      createdAt: new Date().toLocaleDateString()
    }
    const updated = [...records, newRecord]
    setRecords(updated)
    localStorage.setItem('patientRecords', JSON.stringify(updated))
  }

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() => setModal('new')}
          className="px-4 py-2 bg-[#0f766e] text-white rounded hover:bg-teal-700"
        >
          {lang === 'ar' ? '+ سجل جديد' : '+ New Record'}
        </button>
      </div>

      {records.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {lang === 'ar' ? 'لا توجد سجلات محفوظة' : 'No patient records yet'}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead className="bg-[#ecfdfa]">
              <tr>
                <th className="border p-2 text-left">{lang === 'ar' ? 'الاسم' : 'Name'}</th>
                <th className="border p-2 text-left">{lang === 'ar' ? 'العمر' : 'Age'}</th>
                <th className="border p-2 text-left">{lang === 'ar' ? 'نوع' : 'Type'}</th>
                <th className="border p-2 text-left">{lang === 'ar' ? 'التشخيص' : 'Diagnosis'}</th>
                <th className="border p-2 text-left">{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                <th className="border p-2 text-center">{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-gray-50">
                  <td className="border p-2">{rec.name}</td>
                  <td className="border p-2">{rec.age}</td>
                  <td className="border p-2">{rec.type}</td>
                  <td className="border p-2 text-sm">{rec.diagnosis || 'N/A'}</td>
                  <td className="border p-2 text-sm">{rec.createdAt}</td>
                  <td className="border p-2 text-center flex gap-2 justify-center">
                    <button
                      onClick={() => setModal({ type: 'view', record: rec })}
                      className="text-blue-600 hover:text-blue-800"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => deleteRecord(rec.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && modal.type === 'view' && (
        <Modal
          lang={lang}
          record={modal.record}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

function Modal({ lang, record, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded p-6 max-w-md max-h-96 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-3">{record.name}</h3>
        <div className="space-y-2 text-sm">
          <p>
            <strong>{lang === 'ar' ? 'العمر:' : 'Age:'}</strong> {record.age}
          </p>
          <p>
            <strong>{lang === 'ar' ? 'الوزن:' : 'Weight:'}</strong> {record.weight} kg
          </p>
          <p>
            <strong>{lang === 'ar' ? 'الطول:' : 'Height:'}</strong> {record.height} cm
          </p>
          <p>
            <strong>{lang === 'ar' ? 'BMI:' : 'BMI:'}</strong> {(record.weight / ((record.height / 100) ** 2)).toFixed(1)}
          </p>
          <p>
            <strong>{lang === 'ar' ? 'النوع:' : 'Type:'}</strong> {record.type}
          </p>
          <p>
            <strong>{lang === 'ar' ? 'التشخيص:' : 'Diagnosis:'}</strong> {record.diagnosis || 'N/A'}
          </p>
          <p>
            <strong>{lang === 'ar' ? 'الوصفة:' : 'Prescription:'}</strong>
          </p>
          <pre className="bg-gray-100 p-2 rounded text-xs whitespace-pre-wrap max-h-40 overflow-y-auto">
            {record.prescription || 'N/A'}
          </pre>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full px-3 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          {lang === 'ar' ? 'إغلاق' : 'Close'}
        </button>
      </div>
    </div>
  )
}
