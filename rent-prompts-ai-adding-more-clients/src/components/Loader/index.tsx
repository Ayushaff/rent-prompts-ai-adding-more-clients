'use client'
import React, { useState, useEffect } from 'react'
import { Icons } from './Icons'

const Loader = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])

  return (
    <div className="items-center justify-center">
      {loading && (
        <div className="fixed flex inset-0 items-center justify-center bg-black/[0.2] p-2 backdrop-blur-md z-50 ">
          <Icons.logo className="w-[15%] md:w-[10%] lg:w-[5%] fill-white animate-pulse" />
        </div>
      )}
    </div>
  )
}

export default Loader
