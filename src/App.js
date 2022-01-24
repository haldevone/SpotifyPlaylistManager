import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import { useAuthContext } from './hooks/useAuthContext';
import WebApp from './pages/webapp/WebApp';
import ListBase from './pages/listBase/ListBase';


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
        {/* <Route path="/listBase" 
        element={user ? <ListBase /> : <Navigate to="/login"/>}/> */}
      </Routes>
    </Router>)
    }
    </>
  )  
}

export default App;
