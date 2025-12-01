import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Wizard from './components/Wizard'
import LoginPage from './components/LoginPage'
import AdminDashboard from './components/AdminDashboard'
import useAuth from './lib/useAuth'

export default function App() {
  const [lang, setLang] = useState('en')
  const [currentStep, setCurrentStep] = useState(0)
  const [currentPage, setCurrentPage] = useState('wizard') // 'login', 'wizard', 'admin'
  const auth = useAuth()

  useEffect(() => {
    // This logic should now correctly handle navigation after the loading is complete.
    if (!auth.loading) {
      if (auth.isAuthenticated) {
        if (auth.isAdmin) {
          setCurrentPage('admin')
        } else {
          setCurrentPage('wizard')
        }
      } else {
        setCurrentPage('login')
      }
    }
  }, [auth.isAuthenticated, auth.isAdmin, auth.loading])

  const handleLogout = async () => {
    await auth.signOut()
    setCurrentPage('login')
  }

  const handleLoginSuccess = () => {
    // After login, the useEffect above will handle the redirect.
    // We can just rely on the auth state change.
  }

  // Display a global loading screen while the auth state is being determined.
  if (auth.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading Application...</p>
      </div>
    )
  }

  if (currentPage === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />
  }

  if (currentPage === 'admin') {
    return <AdminDashboard lang={lang} onLogout={handleLogout} />
  }

  return (
    <div className={`min-h-screen flex ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Sidebar lang={lang} setLang={setLang} currentStep={currentStep} onStepClick={setCurrentStep} onLogout={handleLogout} />
      <main className="flex-1 bg-gray-50 p-4 md:p-8 overflow-auto">
        <Wizard lang={lang} currentStep={currentStep} onStepChange={setCurrentStep} />
      </main>
    </div>
  )
}
