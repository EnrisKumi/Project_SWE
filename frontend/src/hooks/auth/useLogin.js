import { useState, useEffect } from 'react'
import { useAuthContext } from './useAuthContext'
import { Auth} from "aws-amplify";

export const useLogin = () => {
  
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  const login = async (username, password) => {
    setError(null)
    setIsPending(true)
  
    try {
      
      const user = await Auth.signIn(username, password);

      // dispatch login action
      dispatch({ type: 'LOGIN', payload: user })

        setIsPending(false)
        setError(null)

    } 
    catch(err) {
        setError(err.message)
        setIsPending(false)

    }
  }


  return { login, isPending, error }
}


