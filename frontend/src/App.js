import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

//pages and components
import Navbar from './components/Navbar'

import Login from './pages/landing/Login';
import Signup from './pages/landing/Signup';
import Forgot from './pages/landing/Forgot'
import ResetPassword from './pages/landing/Reset'

import Start from './pages/start/Start'
import Campaign from './pages/campaign/Campaign'
import Npc from './pages/npc/npcs/Npc'
import AddNPC from './pages/npc/addNPC/AddNPC'
import EditNPC from './pages/npc/editNPC/EditNPC'

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
              path="/campaign/:id"
              element={user ? <Campaign /> : <Navigate to="/login" />}
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
