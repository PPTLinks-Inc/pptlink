import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import UserContextProvider from './contexts/userContext';
import SocketContextProvider from './contexts/socketContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <SocketContextProvider>
        <App />
      </SocketContextProvider>
    </UserContextProvider>
  </React.StrictMode>
);
