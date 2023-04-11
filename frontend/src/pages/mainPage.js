import React from 'react'
import {useLogout} from '../hooks/useLogout'


export default function MainPage() {

    const {logout ,isPending}=useLogout();

  return (
    <div>
        <p>Main Page</p>
        <button onClick={logout}>Logout</button>
    </div>
    
    )
}
