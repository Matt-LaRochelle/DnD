import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

// Components
import Navbar from './components/navbar/Navbar'
import Background from './components/background/Background';

// Landing Pages
import Login from './pages/landing/Login';
import Signup from './pages/landing/Signup';
import Forgot from './pages/landing/Forgot'
import ResetPassword from './pages/landing/Reset'

// Main Pages
import Home from './pages/home/Home'
import Settings from './pages/settings/Settings'
import Campaign from './pages/campaign/Campaign'
import CampaignDescription from './pages/campaign/CampaignDescription'
import EditCampaign from './pages/campaign/EditCampaign'
import CampaignSettings from './pages/settings/CampaignSettings';
import Dice from './pages/dice/Dice'

import Maps from './pages/collections/maps/Maps';
import Map from './pages/singles/single/map/Map'
import AddMap from './pages/singles/add/AddMap'
import EditMap from './pages/singles/edit/EditMap'

import NonPlayerCharacters from './pages/collections/characters/NonPlayerCharacters';
import Npc from './pages/singles/single/Npc'
import AddNPC from './pages/singles/add/AddNPC'
import EditNPC from './pages/singles/edit/EditNPC'

import PlayerCharacters from './pages/collections/characters/PlayerCharacters';
import Pc from './pages/singles/single/Pc'
import AddPC from './pages/singles/add/AddPC'
import EditPC from './pages/singles/edit/EditPC'

import Quests from './pages/collections/quests/Quests';
import Quest from './pages/singles/single/Quest'
import AddQuest from './pages/singles/add/AddQuest'
import EditQuest from './pages/singles/edit/EditQuest'

import Creatures from './pages/collections/creatures/Creatures';
import Creature from './pages/singles/single/Creature'
import AddCreature from './pages/singles/add/AddCreature'
import EditCreature from './pages/singles/edit/EditCreature'


function App() {
  const { user } = useAuthContext()

  return (
    <div className="App">
      <Background />
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route 
              path="/"
              element={user ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/campaign"
              element={user ? <CampaignDescription /> : <Navigate to="/login" />}
            />
            <Route 
              path="/settings"
              element={user ? <Settings /> : <Navigate to="/login" />}
            />
            <Route 
              path="/campaign-settings"
              element={user ? <CampaignSettings /> : <Navigate to="/login" />}
            />
            <Route 
              path="/campaign/:id"
              element={user ? <Campaign /> : <Navigate to="/login" />}
            />
            <Route 
              path="/campaign/edit/:id"
              element={user ? <EditCampaign /> : <Navigate to="/login" />}
            />
            <Route
              path="/dice"
              element={user ? <Dice /> : <Navigate to="/login" />}
            />
            <Route
              path="/player-characters"
              element={user ? <PlayerCharacters /> : <Navigate to="/login" />}
            />
            <Route
              path="/non-player-characters"
              element={user ? <NonPlayerCharacters /> : <Navigate to="/login" />}
            />
            <Route
              path="/creatures"
              element={user ? <Creatures /> : <Navigate to="/login" />}
            />
            <Route
              path="/maps"
              element={user ? <Maps /> : <Navigate to="/login" />}
            />
            <Route
              path="/quests"
              element={user ? <Quests /> : <Navigate to="/login" />}
            />
            <Route 
              path="/map/:id"
              element={user ? <Map /> : <Navigate to="/login" />}
            />
            <Route 
              path="/map/add"
              element={user ? <AddMap /> : <Navigate to="/login" />}
            />
            <Route 
              path="/map/edit/:id"
              element={user ? <EditMap /> : <Navigate to="/login" />}
            />
            <Route 
              path="/npc/:id"
              element={user ? <Npc /> : <Navigate to="/login" />}
            />
            <Route 
              path="/npc/edit/:id"
              element={user ? <EditNPC /> : <Navigate to="/login" />}
            />
            <Route 
              path="/npc/add"
              element={user ? <AddNPC /> : <Navigate to="/login" />}
            />
            <Route 
              path="/pc/add"
              element={user ? <AddPC /> : <Navigate to="/login" />}
            />
            <Route 
              path="/pc/:id"
              element={user ? <Pc /> : <Navigate to="/login" />}
            />
            <Route 
              path="/pc/edit/:id"
              element={user ? <EditPC /> : <Navigate to="/login" />}
            />
            <Route 
              path="/creature/add"
              element={user ? <AddCreature /> : <Navigate to="/login" />}
            />
            <Route 
              path="/creature/:id"
              element={user ? <Creature /> : <Navigate to="/login" />}
            />
            <Route 
              path="/creature/edit/:id"
              element={user ? <EditCreature /> : <Navigate to="/login" />}
            />
            <Route 
              path="/quest/add-main"
              element={user ? <AddQuest /> : <Navigate to="/login" />}
            />
            <Route 
              path="/quest/add-side"
              element={user ? <AddQuest /> : <Navigate to="/login" />}
            />
            <Route 
              path="/quest/add/:id"
              element={user ? <AddQuest /> : <Navigate to="/login" />}
            />
            <Route 
              path="/quest/:id"
              element={user ? <Quest /> : <Navigate to="/login" />}
            />
            <Route 
              path="/quest/edit/:id"
              element={user ? <EditQuest /> : <Navigate to="/login" />}
            />
            <Route 
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route 
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            />
            <Route 
              path="/reset-password/:token"
              element={!user ? <ResetPassword /> : <Navigate to="/" />}
              />
            <Route
              path='/forgot'
              element={!user ? <Forgot /> : <Navigate to="/" />}
              />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
