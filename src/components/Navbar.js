import React from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import useLogout from '../hooks/useLogout';
import './Navbar.css'
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'

function Navbar() {
    const{ user } = useAuthContext();
    const{ logout } = useLogout();
    return (
        <nav className='navbar'>
            <ul className='navbar-list'>
                <li>Spotify Manager</li>
                <li className='navbar-last'>
                    <button className='nav-btn' onClick={logout}>
                        <span className='nav-user'>{user.email.split('@')[0]}</span>
                        <FontAwesomeIcon icon={faUser} className="nav-icon"/>
                    </button>
                    
                </li>
            </ul>
        </nav>
    )
}

export default Navbar
