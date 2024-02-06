import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

//pages and components
import Navbar from './components/navbar/Navbar'

import Login from './pages/landing/Login';
import Signup from './pages/landing/Signup';
import Forgot from './pages/landing/Forgot'
import ResetPassword from './pages/landing/Reset'

import Start from './pages/start/Start'
import Settings from './pages/settings/Settings'
import Campaign from './pages/campaign/Campaign'
import EditCampaign from './pages/campaign/EditCampaign'
import Map from './pages/map/map/Map'
import AddMap from './pages/map/addMap/AddMap'
import EditMap from './pages/map/editMap/EditMap'
import Npc from './pages/npc/character/Npc'
import Pc from './pages/npc/character/Pc'
import AddNPC from './pages/npc/addCharacter/AddNPC'
import AddPC from './pages/npc/addCharacter/AddPC'
import EditNPC from './pages/npc/editCharacter/EditNPC'
import EditPC from './pages/npc/editCharacter/EditPC'

function App() {
  const { user } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route 
              path="/"
              element={user ? <Start /> : <Navigate to="/login" />}
            />
            <Route 
              path="/settings"
              element={user ? <Settings /> : <Navigate to="/login" />}
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
