import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import { useAuthContext } from './hooks/useAuthContext';
import WebApp from './pages/webapp/WebApp';


function App() {
  const { authIsReady, user } = useAuthContext();

  return (
    <>
    {authIsReady &&
    (<Router>
      <Routes>
        <Route path="/"
        element={ user ? <Home /> : <Navigate to="/login"/>}/>
        <Route path="/login"
        element={ !user ? <Login /> : <Navigate to="/"/>}/>
        {/* <Route path="/webapp" 
        element={user ? <WebApp /> : <Navigate to="/login"/>}/> */}
      </Routes>
    </Router>)
    }
    </>
  )  
}

export default App;
