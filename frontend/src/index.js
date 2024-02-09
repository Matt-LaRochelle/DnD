import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CampaignsContextProvider } from './context/CampaignContext'
import { PcsContextProvider } from './context/PcContext';
import { NpcsContextProvider } from './context/NpcContext';
import { MapsContextProvider } from './context/MapContext';
import { CreaturesContextProvider } from './context/CreatureContext';
import { QuestsContextProvider } from './context/QuestContext';
import { AuthContextProvider } from './context/AuthContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <CampaignsContextProvider>
        <PcsContextProvider>
          <NpcsContextProvider>
            <MapsContextProvider>
              <QuestsContextProvider>
                <CreaturesContextProvider>
                  <App />
                </CreaturesContextProvider>
              </QuestsContextProvider>
            </MapsContextProvider>
          </NpcsContextProvider>
        </PcsContextProvider>
      </CampaignsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
