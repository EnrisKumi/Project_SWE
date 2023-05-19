import { useState} from 'react'
import { useAuthContext } from './useAuthContext'
import { Auth} from "aws-amplify";


export const useSignup = () => {
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

        setIsPending(false)
        setError('confirm')
    } 
    catch(err) {
        setError(err.message)
        setIsPending(false)
    }
  }

  return { signup, error, isPending }
}