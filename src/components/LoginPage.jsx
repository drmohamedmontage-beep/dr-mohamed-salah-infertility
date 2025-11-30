import React, { useState } from 'react'
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react'
import useAuth from '../lib/useAuth'

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [fullName, setFullName] = useState('')
  const [specialization, setSpecialization] = useState('doctor')
  const [clinic, setClinic] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const auth = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isSignUp) {
        await auth.signUp(email, password, {
          name: fullName,
          specialization,
          clinic,
          role: 'doctor',
        })
        setMessage('تم إنشاء الحساب بنجاح! يرجى تسجيل الدخول.')
        setIsSignUp(false)
        setEmail('')
        setPassword('')
        setFullName('')
      } else {
        await auth.signIn(email, password)
        onLoginSuccess?.()
      }
    } catch (err) {
      setMessage(err.message || 'حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-teal-100 p-3 rounded-full">
            <LogIn className="w-6 h-6 text-teal-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          {isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
        </h1>
        <p className="text-center text-gray-600 mb-6">
          {isSignUp ? 'إنشاء حساب طبيب جديد' : 'نظام دعم القرار السريري'}
        </p>

        {message && (
          <div className={`p-3 rounded mb-4 flex items-center ${
            message.includes('خطأ') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            <AlertCircle className="w-4 h-4 ml-2" />
            {message}
          </div>
        )}

        {auth.error && (
          <div className="p-3 rounded mb-4 bg-red-50 text-red-700 flex items-center">
            <AlertCircle className="w-4 h-4 ml-2" />
            {auth.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="د. محمد علي"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    التخصص
                  </label>
                  <select
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="doctor">طبيب</option>
                    <option value="nurse">ممرضة</option>
                    <option value="admin">مسؤول</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    العيادة
                  </label>
                  <input
                    type="text"
                    value={clinic}
                    onChange={(e) => setClinic(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="عيادة الخصوبة"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'جاري المعالجة...' : isSignUp ? 'إنشاء الحساب' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            {isSignUp ? 'لديك حساب بالفعل؟ سجل الدخول' : 'ليس لديك حساب؟ إنشاء حساب جديد'}
          </button>
        </div>
      </div>
    </div>
  )
}
