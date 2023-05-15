import { useEffect, useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { Auth} from "aws-amplify";

export const useLogout = () => {
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const {dispatch} = useAuthContext()
  
  const logout = async () => {
    setError(null)
    setIsPending(true)
    try {

      // sign the user out
      await Auth.signOut()
      
      // dispatch logout action
      dispatch({ type: 'LOGOUT' })

      // update state
        setIsPending(false)
        setError(null)
    } 
    catch(err) {
        setError(err.message)
        setIsPending(false)
    }
  }

  return { logout, error, isPending }
}