import { useState, useEffect } from 'react'
import { useAuthContext } from './useAuthContext'
import { Auth} from "aws-amplify";

import React from 'react'

export const useForgotPassword = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  const forgorPassword = async (username,authCode,newPassword) => {
    setError(null)
    setIsPending(true)
  
    try {
      
        await Auth.forgotPassword(username);

      // dispatch forgotPassword action
       dispatch({ type: 'FORGOT_PASS', payload: true })

       Auth.forgotPasswordSubmit(username, authCode, newPassword);

      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      }
    } 
    catch(err) {
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
      }
    }
  }
  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { forgorPassword, error, isPending }
}
