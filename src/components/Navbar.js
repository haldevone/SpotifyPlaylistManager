import React from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import useLogout from '../hooks/useLogout';
import './Navbar.css'
import { Link } from 'react-router-dom';

function Navbar() {
    const{ user } = useAuthContext();
    const{ logout } = useLogout();
    return (
        <nav className='navbar'>
            <ul className='navbar-list'>
                <li>My Spotify Playlist</li>
                <li className='navbar-last'>
                    <button className='nav-btn' onClick={logout}>Logout</button>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar
