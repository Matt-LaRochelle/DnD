import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

//pages and components
import Navbar from './components/Navbar'

import Login from './pages/landing/Login';
import Signup from './pages/landing/Signup';
import Forgot from './pages/landing/Forgot'
import ResetPassword from './pages/landing/Reset'

import Home from './pages/Home'
import Campaign from './pages/campaign/Campaign'
import Map from './pages/map/Map'

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
              element={user ? <Home /> : <Navigate to="/login" />}
            />
            <Route 
              path="/campaign/:id"
              element={user ? <Campaign /> : <Navigate to="/login" />}
            />
            <Route 
              path="/map"
              element={user ? <Map /> : <Navigate to="/login" />}
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
