import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Amplify } from 'aws-amplify';
import { Auth } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <Authenticator>
    {({ signOut, user }) =>(
    <React.StrictMode>
      <App signOut={signOut} user={user} />
    </React.StrictMode>
  )}
  </Authenticator>

);

