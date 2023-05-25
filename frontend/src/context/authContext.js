import { createContext, useReducer, useEffect } from 'react'
import {Auth , Hub } from "aws-amplify";
import axios from 'axios';
export const AuthContext = createContext()
const url = "https://2pj6vv3pwi.execute-api.eu-central-1.amazonaws.com/prod/";

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload}
    case 'LOGOUT':
      return { ...state, user: null,currentUser: null}
    case 'AUTH_IS_READY':
      return { user: action.payload, authIsReady: true}
    case 'CONFIRM_SIGNUP':
        return {...state,confirmSignup: action.payload}    
    case 'USERNAME':
      return {...state,username: action.payload}
    case 'SET_USER':
      return {...state,currentUser:action.payload}  
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { 
    user: null,
    authIsReady: false,
    username:null,
    confirmSignup:false,
    currentUser:null,
  })

  const getUser = async(cognitoId,token) => {

    const requestInfo = {
      headers: {
        Authorization: token,
      },
    };

    const res = await axios.get(`${url}user/getCognitoUserById?cognitoId=${cognitoId}`,
    requestInfo)
    dispatch({ type: 'SET_USER', payload: res })
  }

 const checkUser= async () => {
    try{
            const authUser=await Auth.currentAuthenticatedUser({bypassCache: true});
            dispatch({ type: 'AUTH_IS_READY', payload: authUser })
            getUser(authUser.attributes.sub,authUser.signInUserSession.idToken.jwtToken)
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