import { useState} from 'react'
import { useAuthContext } from './useAuthContext'
import { Auth} from "aws-amplify";


export const useConfirmSignUp = () => {
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()
  const {username} = useAuthContext();

  const confirmSignup = async (authCode) => {
    setError(null)
    setIsPending(true)
  
    try {
        await Auth.confirmSignUp(username, authCode);

        // dispatch confirmSignUp action
        dispatch({ type: 'CONFIRM_SIGNUP', payload:true })

        setIsPending(false)
        setError(null)

    } 
    catch(err) {
  
        setError(err.message)
        setIsPending(false)
    }
  }


  return { confirmSignup, error, isPending }
}
