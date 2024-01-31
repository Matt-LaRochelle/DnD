import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CampaignsContextProvider } from './context/CampaignContext'
import { PcsContextProvider } from './context/PcContext';
import { NpcsContextProvider } from './context/NpcContext';
import { AuthContextProvider } from './context/AuthContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <CampaignsContextProvider>
        <PcsContextProvider>
          <NpcsContextProvider>
            <App />
          </NpcsContextProvider>
        </PcsContextProvider>
      </CampaignsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
