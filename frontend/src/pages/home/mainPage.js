import React from 'react'
import {useLogout} from '../../hooks/auth/useLogout'
import Navbar from '../../components/navbar.js'
import {useApi} from '../../hooks/api/useApi';




export default function MainPage() {
 
    const {logout ,isPending}=useLogout();

    const { getMongoIdFromCognitoId }=useApi();
    

    getMongoIdFromCognitoId().then((res)=>{
      console.log(res);
    })

  return (
    <div>
        <Navbar called="main" />
        <p>Main Page</p>
        <button onClick={logout}>Logout</button>
    </div>
    
    )
}
