import { useState, useEffect } from 'react'
import { useAuthContext } from './useAuthContext'
import { Auth} from "aws-amplify";


export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  const signup = async (username,email, password) => {
    setError(null)
    setIsPending(true)
  
    try {
      
      await Auth.signUp({ username, password, attributes: { email } });

      //dispatch confirmSignUp action
      dispatch({ type: 'CONFIRM_SIGNUP', payload:{username:username,confirm:false} })

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

  return { signup, error, isPending }
}