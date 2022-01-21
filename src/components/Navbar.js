import React from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import useLogout from '../hooks/useLogout';
import './Navbar.css'
import { Link } from 'react-router-dom';

function Navbar() {
    const{ user } = useAuthContext();
    const{ logout } = useLogout();
    return (
        <div className='navbar'>
            <ul className='navbar-list'>
                <li>My Spotify Playlist</li>
                <li>
                    {/* <p>hello, {user.displayName}</p> */}
                    <button className='nav-btn' onClick={logout}>Logout</button>
                </li>
            </ul>
        </div>
    )
}

export default Navbar
