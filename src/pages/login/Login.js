import React, { useState } from 'react'
import useLogin from '../../hooks/useLogin';
import Hero from './Hero';
import './Login.css'

function Login() {

    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const{login, error, isPending} = useLogin();

    const handleSubmit = (event) => {
        event.preventDefault();
        login(email, password);
    } 

    return (
        <>
            <Hero />
            <form onSubmit={handleSubmit} className={'login-form'}>
                <h2>Login</h2>
                <label>
                    <span>Email:</span>
                    <input 
                    type="email"
                    onChange={(event) => 
                        setEmail(event.target.value)} 
                    value={email}
                    />
                </label>
                <label>
                    <span>Password:</span>
                    <input 
                    type="password"
                    onChange={(event) => 
                        setPassword(event.target.value)} 
                    value={password}
                    />
                </label>
                {!isPending && <button className='btn'>Login</button>}
                {isPending && <button className='btn' disabled>Loading..</button>}
                {error && <p>{error}</p>}
                
            </form>
        </>
    )
}

export default Login
