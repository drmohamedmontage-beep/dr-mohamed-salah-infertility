import React, { useState, useEffect } from 'react'
import { Users, FileText, Pill, BarChart3, Settings, LogOut, Activity } from 'lucide-react'
import { patientService, medicineService, analyticsService, auditService, userService } from '../lib/supabase'
import useAuth from '../lib/useAuth'

export default function AdminDashboard({ lang, onLogout }) {
  const auth = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [patients, setPatients] = useState([])
  const [medicines, setMedicines] = useState([])
  const [staff, setStaff] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('Dashboard useEffect: auth.profile =', auth.profile)
    if (auth.profile?.clinic_id) {
      console.log('Loading dashboard data with clinic_id:', auth.profile.clinic_id)
      loadDashboardData()
    } else {
      console.log('Dashboard waiting for auth.profile or clinic_id')
    }
  }, [auth.profile])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load stats
      const statsData = await analyticsService.getStats(auth.profile?.clinic_id)
      setStats(statsData)

      // Load patients
      const { data: patientsData } = await patientService.getAll()
      setPatients(patientsData || [])

      // Load medicines
      const { data: medicinesData } = await medicineService.getAll()
      setMedicines(medicinesData || [])

      // Load staff
      if (auth.isAdmin) {
        const { data: staffData } = await userService.getAllStaff(auth.profile?.clinic_id)
        setStaff(staffData || [])

        // Load audit logs
        const { data: logsData } = await auditService.getAll(50)
        setAuditLogs(logsData || [])
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const isArabic = lang === 'ar'

  return (
    <div className={`min-h-screen bg-gray-50 ${isArabic ? 'rtl' : 'ltr'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isArabic ? 'لوحة التحكم' : 'Dashboard'}
            </h1>
            <p className="text-sm text-gray-600">
              {isArabic ? 'مرحبا' : 'Welcome'}, {auth.profile?.name}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            <LogOut className="w-4 h-4" />
            {isArabic ? 'تسجيل الخروج' : 'Logout'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex gap-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 border-b-2 font-medium transition ${
              activeTab === 'overview'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline ml-2" />
            {isArabic ? 'نظرة عامة' : 'Overview'}
          </button>

          <button
            onClick={() => setActiveTab('patients')}
            className={`px-4 py-3 border-b-2 font-medium transition ${
              activeTab === 'patients'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4 inline ml-2" />
            {isArabic ? 'المرضى' : 'Patients'} ({patients.length})
          </button>

          <button
            onClick={() => setActiveTab('medicines')}
            className={`px-4 py-3 border-b-2 font-medium transition ${
              activeTab === 'medicines'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Pill className="w-4 h-4 inline ml-2" />
            {isArabic ? 'الأدوية' : 'Medicines'} ({medicines.length})
          </button>

          {auth.isAdmin && (
            <>
              <button
                onClick={() => setActiveTab('staff')}
                className={`px-4 py-3 border-b-2 font-medium transition ${
                  activeTab === 'staff'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-4 h-4 inline ml-2" />
                {isArabic ? 'الموظفون' : 'Staff'} ({staff.length})
              </button>

              <button
                onClick={() => setActiveTab('audit')}
                className={`px-4 py-3 border-b-2 font-medium transition ${
                  activeTab === 'audit'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Activity className="w-4 h-4 inline ml-2" />
                {isArabic ? 'السجلات' : 'Logs'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">{isArabic ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">{isArabic ? 'إجمالي المرضى' : 'Total Patients'}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalPatients || 0}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">{isArabic ? 'التشخيصات' : 'Diagnoses'}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalDiagnoses || 0}</p>
                    </div>
                    <FileText className="w-8 h-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">{isArabic ? 'الأدوية' : 'Medicines'}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{medicines.length}</p>
                    </div>
                    <Pill className="w-8 h-8 text-purple-500" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">{isArabic ? 'الموظفون' : 'Staff'}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{staff.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Patients Tab */}
            {activeTab === 'patients' && (
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
                          {isArabic ? 'التاريخ' : 'Date'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((patient) => (
                        <tr key={patient.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{patient.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{patient.age}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{patient.phone}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(patient.created_at).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Medicines Tab */}
            {activeTab === 'medicines' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {medicines.map((medicine) => (
                  <div key={medicine.id} className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-bold text-gray-900">{medicine.name}</h3>
                    <p className="text-sm text-gray-600 mt-2">{isArabic ? 'الفئة' : 'Category'}: {medicine.category}</p>
                    <p className="text-sm text-gray-600">{isArabic ? 'الجرعة' : 'Dosage'}: {medicine.dosage}</p>
                    <p className="text-sm text-gray-600">{medicine.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Staff Tab */}
            {activeTab === 'staff' && auth.isAdmin && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                          {isArabic ? 'الاسم' : 'Name'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                          {isArabic ? 'الدور' : 'Role'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                          {isArabic ? 'التخصص' : 'Specialization'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                          {isArabic ? 'الحالة' : 'Status'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {staff.map((member) => (
                        <tr key={member.user_id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{member.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{member.role}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{member.specialization}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                              {isArabic ? 'نشط' : 'Active'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Audit Logs Tab */}
            {activeTab === 'audit' && auth.isAdmin && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                          {isArabic ? 'الإجراء' : 'Action'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                          {isArabic ? 'التفاصيل' : 'Details'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                          {isArabic ? 'التاريخ' : 'Date'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((log, idx) => (
                        <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{log.action}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{log.details}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(log.created_at).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
