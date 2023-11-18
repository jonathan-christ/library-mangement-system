import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()

  useEffect(()=>{
    navigate('home')
  }, [])
  return (
    <span>
      <h1>404</h1>
      Looks like your page isn't found
      <br /><br />
    </span>
  )
}

export default NotFound