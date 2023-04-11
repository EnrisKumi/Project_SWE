import './App.css';
import { BrowserRouter, Route, Routes,Navigate} from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import {Amplify} from 'aws-amplify'
import awsconfig from './aws-exports'
import Login from "./pages/login.js"
import SignUp from './pages/signUp';
import MainPage from './pages/mainPage'
import ConfirmSignUp from './pages/confirmSignUp'


Amplify.configure(awsconfig);



function App() {

  const { authIsReady, user,confirmSignUp } = useAuthContext();
  
  const confirm=confirmSignUp?.confirm;

  return (
    <div className="App">
    {/* <Authenticator>
      {({ signOut }) => (
        <div className="App">
          <p>
            Hey Enris
          </p>
          <button onClick={signOut}>Sign out</button>
        </div>
      )}
    </Authenticator> */}
    {authIsReady && (
    <BrowserRouter>
      <Routes>
      <Route
          path="/"
          element={!user ? <Login/> : <Navigate to={"/mainPage"} />}
        />

       <Route 
       path="/mainPage" 
       element={ user ? <MainPage /> : <Navigate to={"/login"} />} 
       />
        <Route
          path="/login"
          element={!user ? <Login/> : <Navigate to={"/"} />}
        />

        <Route
          path="/signup"
          element={!user ? <SignUp/> : <Navigate to={"/"} />}
        />

        <Route
          path="/confirmSignup"
          element={!confirm ? <ConfirmSignUp/> : <Navigate to={"/login"} />}
        />
      </Routes>
    </BrowserRouter>
     )}
    </div>
  );
}

export default App;
