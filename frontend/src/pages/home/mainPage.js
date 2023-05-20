import React from 'react'
import {useLogout} from '../../hooks/auth/useLogout'
import Navbar from '../../components/navbar.js'



export default function MainPage() {
 
    const {logout ,isPending}=useLogout();

  return (
    <div>
        <Navbar called="main" />
        <p>Main Page</p>
        <button onClick={logout}>Logout</button>
        
    </div>
    
    )
}
