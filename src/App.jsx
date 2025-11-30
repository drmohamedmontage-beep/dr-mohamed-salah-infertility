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
    if (auth.isAuthenticated) {
      if (auth.isAdmin) {
        setCurrentPage('admin')
      } else {
        setCurrentPage('wizard')
      }
    } else {
      setCurrentPage('login')
    }
  }, [auth.isAuthenticated, auth.isAdmin])

  const handleLogout = async () => {
    await auth.signOut()
    setCurrentPage('login')
  }

  const handleLoginSuccess = () => {
    if (auth.isAdmin) {
      setCurrentPage('admin')
    } else {
      setCurrentPage('wizard')
    }
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
