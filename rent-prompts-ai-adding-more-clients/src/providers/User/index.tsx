'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

interface User {
  id: string;
  email: string;
  role: string;
  coinBalance: number;
  profileImage: string;
  sharedApps: number;
}

const UserContext = createContext<User | null>(null);

const fetchCurrentUser = async () => {
  try {
    const res = await axios.get('/api/users/getUser')
    if (!res) throw new Error('Failed to fetch user')
    const user = res.data.data;
    return user;
  } catch (error) {
    return null;
  }
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({} as User)

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await fetchCurrentUser()
      setUser(userData)
    }
    fetchUser()
  }, [])

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)
