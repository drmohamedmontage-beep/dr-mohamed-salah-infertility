import { useState, useEffect } from 'react'
import { supabase, userService } from './supabase'

// Minimal auth hook that matches the default import expected by components
export default function useAuth() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    async function init() {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser()
        if (!mounted) return
        setUser(currentUser ?? null)
        console.log('Current user:', currentUser)
        if (currentUser) {
          const { data } = await userService.getProfile(currentUser.id)
          if (!mounted) return
          console.log('User profile loaded:', data)
          setProfile(data ?? null)
        }
      } catch (err) {
        if (!mounted) return
        console.error('Auth init error:', err)
        setError(err)
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    init()

    const sub = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        console.log('Auth state changed:', currentUser)
        if (currentUser) {
          const { data } = await userService.getProfile(currentUser.id)
          console.log('Profile loaded on auth change:', data)
          setProfile(data ?? null)
        } else {
          setProfile(null)
        }
      } catch (err) {
        console.error('Auth state change error:', err)
        setError(err)
      }
    })

    return () => {
      mounted = false
      try {
        // cleanup listener
        sub?.subscription?.unsubscribe?.()
      } catch (e) {
        // ignore
      }
    }
  }, [])

  async function signUp({ email, password, metadata } = {}) {
    setLoading(true)
    try {
      const { data, error } = await userService.signUp({ email, password, metadata })
      if (error) throw error
      const newUser = data?.user ?? null
      setUser(newUser)

      // If sign up returned a user and metadata provided, create a profile row
      if (newUser && metadata) {
        try {
          const { data: profileData, error: profileError } = await userService.createProfile(newUser.id, metadata)
          if (!profileError) {
            // profileData may be an array (insert .select returns array)
            setProfile(Array.isArray(profileData) ? profileData[0] ?? null : profileData ?? null)
          }
        } catch (e) {
          console.error('Failed to create profile after signup:', e)
        }
      }

      return { data, error: null }
    } catch (err) {
      setError(err)
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  async function signIn({ email, password } = {}) {
    setLoading(true)
    try {
      const { data, error } = await userService.signIn({ email, password })
      if (error) throw error
      setUser(data?.user ?? null)
      return { data, error: null }
    } catch (err) {
      setError(err)
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  async function signOut() {
    setLoading(true)
    try {
      const { error } = await userService.signOut()
      if (error) throw error
      setUser(null)
      setProfile(null)
      return { error: null }
    } catch (err) {
      setError(err)
      return { error: err }
    } finally {
      setLoading(false)
    }
  }

  async function refreshProfile() {
    if (!user) return null
    try {
      const { data } = await userService.getProfile(user.id)
      setProfile(data ?? null)
      return data
    } catch (err) {
      setError(err)
      return null
    }
  }

  function isAuthenticated() {
    return !!user
  }

  function isAdmin() {
    return profile?.role === 'admin'
  }

  function hasPermission(permission) {
    if (!profile) return false
    if (profile.role === 'admin') return true
    const perms = profile.permissions ?? []
    return perms.includes(permission)
  }

  return {
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    refreshProfile,
    isAuthenticated,
    isAdmin,
    hasPermission,
  }
}
