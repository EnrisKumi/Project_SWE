import { useState} from 'react'
import { useAuthContext } from './useAuthContext'
import { Auth} from "aws-amplify";


export const useConfirmSignUp = () => {
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()
  const {confirmSignUp } = useAuthContext();
  const username = confirmSignUp?.username;
  console.log(confirmSignUp);

  const confirmSignup = async (authCode) => {
    setError(null)
    setIsPending(true)
  
    try {
      
        await Auth.confirmSignUp(username, authCode);

      // dispatch confirmSignUp action
       dispatch({ type: 'CONFIRM_SIGNUP', payload:{username:null,confirm:true} })

        setIsPending(false)
        setError(null)

    } 
    catch(err) {
  
        setError('Wrong Authentication code')
        setIsPending(false)
    }
  }


  return { confirmSignup, error, isPending }
}
