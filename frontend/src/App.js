import './App.css';
import { BrowserRouter, Route, Routes,Navigate} from 'react-router-dom'
import { useAuthContext } from './hooks/auth/useAuthContext'

import '@aws-amplify/ui-react/styles.css';
import {Amplify} from 'aws-amplify'
import awsconfig from './aws-exports'
import Login from "./pages/auth/login.js"
import SignUp from './pages/auth/signUp';
import MainPage from './pages/home/mainPage'
import ConfirmSignUp from './pages/auth/confirmSignUp'
import ForgotPassword from './pages/auth/forgotPassword'
import ChatApp from './chat/chatApp';


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

        <Route
          path="/forgotPassword"
          element={<ForgotPassword/>}
        />

      <Route path="/chat" element={<ChatApp />} />
      
      </Routes>

      
    </BrowserRouter>
     )}
    </div>
  );
}

export default App;
