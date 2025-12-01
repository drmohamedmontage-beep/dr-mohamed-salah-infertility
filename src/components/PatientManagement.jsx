import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react'
import { patientService, auditService } from '../lib/supabase'
import useAuth from '../lib/useAuth'

export default function PatientManagement({ lang }) {
  const auth = useAuth()
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    email: '',
    type: 'primary',
    duration: '',
    status: 'active',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (auth.profile?.clinic_id || auth.user) {
      loadPatients()
    }
  }, [auth.profile, auth.user])

  useEffect(() => {
    if (searchTerm) {
      setFilteredPatients(
        patients.filter(p =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.phone.includes(searchTerm)
        )
      )
    } else {
      setFilteredPatients(patients)
    }
  }, [searchTerm, patients])

  const loadPatients = async () => {
    const filters = auth.profile?.clinic_id ? { clinic_id: auth.profile.clinic_id } : {}
    const { data, error } = await patientService.getAll(filters)
    if (!error) {
      setPatients(data || [])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (selectedPatient) {
        const { error } = await patientService.update(selectedPatient.id, formData)
        if (!error) {
          await auditService.log('UPDATE_PATIENT', `Updated patient: ${formData.name}`, auth.user?.id)
          loadPatients()
          setShowForm(false)
          setSelectedPatient(null)
        }
      } else {
        const { error } = await patientService.create(formData)
        if (!error) {
          await auditService.log('CREATE_PATIENT', `Created patient: ${formData.name}`, auth.user?.id)
          loadPatients()
          setShowForm(false)
        }
      }
      resetForm()
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (patient) => {
    setSelectedPatient(patient)
    setFormData({
      name: patient.name,
      age: patient.age,
      phone: patient.phone,
      email: patient.email,
      type: patient.type,
      duration: patient.duration,
      status: patient.status,
    })
    setShowForm(true)
  }

  const handleDelete = async (patientId) => {
    if (confirm(lang === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?')) {
      const { error } = await patientService.delete(patientId)
      if (!error) {
        await auditService.log('DELETE_PATIENT', `Deleted patient ID: ${patientId}`, auth.user?.id)
        loadPatients()
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      phone: '',
      email: '',
      type: 'primary',
      duration: '',
      status: 'active',
    })
    setSelectedPatient(null)
    setShowForm(false)
  }

  const isArabic = lang === 'ar'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isArabic ? 'إدارة المرضى' : 'Patient Management'}
          </h2>
          <p className="text-gray-600 text-sm">
            {isArabic ? `إجمالي: ${patients.length} مريض` : `Total: ${patients.length} patients`}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          <Plus className="w-4 h-4" />
          {isArabic ? 'إضافة مريض' : 'Add Patient'}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder={isArabic ? 'ابحث عن مريض...' : 'Search patient...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">
            {isArabic
              ? selectedPatient ? 'تعديل المريض' : 'إضافة مريض جديد'
              : selectedPatient ? 'Edit Patient' : 'Add New Patient'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder={isArabic ? 'الاسم الكامل' : 'Full Name'}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              required
            />

            <input
              type="number"
              placeholder={isArabic ? 'العمر' : 'Age'}
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              required
            />

            <input
              type="tel"
              placeholder={isArabic ? 'الهاتف' : 'Phone'}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              required
            />

            <input
              type="email"
              placeholder={isArabic ? 'البريد الإلكتروني' : 'Email'}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />

            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="primary">{isArabic ? 'عقم أولي' : 'Primary'}</option>
              <option value="secondary">{isArabic ? 'عقم ثانوي' : 'Secondary'}</option>
            </select>

            <input
              type="text"
              placeholder={isArabic ? 'مدة العقم (سنوات)' : 'Duration (years)'}
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />

            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="active">{isArabic ? 'نشط' : 'Active'}</option>
              <option value="inactive">{isArabic ? 'غير نشط' : 'Inactive'}</option>
            </select>

            <div className="col-span-2 flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
              >
                {loading ? (isArabic ? 'جاري...' : 'Saving...') : isArabic ? 'حفظ' : 'Save'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Patients List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  {isArabic ? 'الاسم' : 'Name'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  {isArabic ? 'العمر' : 'Age'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  {isArabic ? 'الهاتف' : 'Phone'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  {isArabic ? 'النوع' : 'Type'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  {isArabic ? 'الحالة' : 'Status'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  {isArabic ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{patient.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{patient.age}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{patient.phone}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      patient.type === 'primary'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {isArabic
                        ? patient.type === 'primary' ? 'أولي' : 'ثانوي'
                        : patient.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      patient.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {isArabic
                        ? patient.status === 'active' ? 'نشط' : 'غير نشط'
                        : patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button
                      onClick={() => handleEdit(patient)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(patient.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
