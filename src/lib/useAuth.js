import React, { useState, useEffect } from 'react'
import { supabase, userService } from '../lib/supabase'
import { LogOut, User, Lock } from 'lucide-react'

export default function AuthContext() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
    })
    return () => subscription?.unsubscribe()
  }, [])

  const checkUser = async () => {
    const { data, error } = await userService.getCurrentUser()
    setUser(data?.user || null)
    if (data?.user) {
      fetchProfile(data.user.id)
    }
    setLoading(false)
  }

  const fetchProfile = async (userId) => {
    const { data, error } = await userService.getProfile(userId)
    setProfile(data)
  }

  const signUp = async (email, password, profileData) => {
    setLoading(true)
    setError(null)
    const { data, error } = await userService.signUp(email, password)
    if (error) {
      setError(error.message)
      setLoading(false)
      return null
    }
    
    if (data?.user) {
      await userService.updateProfile(data.user.id, {
        user_id: data.user.id,
        ...profileData,
      })
    }
    setLoading(false)
    return data
  }

  const signIn = async (email, password) => {
    setLoading(true)
    setError(null)
    const { data, error } = await userService.signIn(email, password)
    if (error) {
      setError(error.message)
    } else {
      setUser(data?.user || null)
      if (data?.user) {
        fetchProfile(data.user.id)
      }
    }
    setLoading(false)
    return data
  }

  const signOut = async () => {
    setLoading(true)
    const { error } = await userService.signOut()
    if (!error) {
      setUser(null)
      setProfile(null)
    }
    setLoading(false)
  }

  const hasPermission = (permission) => {
    return profile?.permissions?.includes(permission) || profile?.role === 'admin'
  }

  return {
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    hasPermission,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
  }
}
