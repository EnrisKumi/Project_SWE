import { useState} from 'react'
import { useAuthContext } from './useAuthContext'
import { Auth} from "aws-amplify";
import { useNavigate } from 'react-router-dom';



export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(null)
  const { dispatch } = useAuthContext()

  const navigate = useNavigate();

  const signup = async (username,email, password) => {
    setError(null)
    setIsPending(true)
  
    try {
      
      await Auth.signUp({ username, password, attributes: { email } });

      //dispatch confirmSignUp action
      dispatch({ type: 'CONFIRM_SIGNUP', payload:{username:username,confirm:false} })

        setIsPending(false)
        setError(null)
        navigate('/confirmSignup');
    } 
    catch(err) {
        setError(err.message)
        setIsPending(false)
    }
  }

  return { signup, error, isPending}
}