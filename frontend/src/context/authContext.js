import { createContext, useReducer, useEffect } from 'react'
import {Auth , Hub } from "aws-amplify";
export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload}
    case 'LOGOUT':
      return { ...state, user: null}
    case 'AUTH_IS_READY':
      return { user: action.payload, authIsReady: true}
    case 'CONFIRM_SIGNUP':
        return {...state,confirmSignUp: action.payload}    
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { 
    user: null,
    authIsReady: false,
    confirmSignUp: {username:null,confirm:false},
  })

  const checkUser= async () => {
    try{
            const authUser=await Auth.currentAuthenticatedUser({bypassCache: true});
            dispatch({ type: 'AUTH_IS_READY', payload: authUser })
    }catch(e){
            dispatch({ type: 'AUTH_IS_READY', payload: null })
    }
  }

  useEffect(() => {
    checkUser();
  }, [])

  useEffect(() => {
    const listener = data => {
        if(data.payload.event ==='signIn' || data.payload.event === 'signOut'){
            checkUser();
        }
    }
    Hub.listen('auth',listener);
    return () => Hub.remove('auth',listener);
  }, [])

  console.log('AuthContext state:', state)
  
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { children }
    </AuthContext.Provider>
  )

}