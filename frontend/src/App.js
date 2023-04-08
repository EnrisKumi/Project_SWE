import './App.css';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import {Amplify} from 'aws-amplify'
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

function App() {
  return (
    <div className="App">
    <Authenticator>
      {({ signOut }) => (
        <div className="App">
          <p>
            Hey Enris
          </p>
          <button onClick={signOut}>Sign out</button>
        </div>
      )}
    </Authenticator>
    </div>
  );
}

export default App;
