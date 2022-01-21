
import React, { useState, useEffect } from 'react'
import { useAuthContext } from './useAuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

function useLogin() {
    const[isCancelled, SetIsCancelled] = useState(false);
    const[error, setError] = useState(null);
    const[isPending, SetIsPending] = useState(false);
    const { dispatch } = useAuthContext();

    function authSignIn(email, password){
        return signInWithEmailAndPassword(auth, email, password);
      }

    const login = async(email, password) => {
        setError(null);
        SetIsPending(true);

        try {
            const res = await authSignIn(email, password)

            dispatch({type: 'LOGIN', payload: res.user});
            if (!isCancelled) {
                setError(null);
                SetIsPending(false);
            }
        } catch (err) {
            if (!isCancelled) {
                console.log(err.message);
                setError(err.message);
                SetIsPending(false);
            }
        }
    }
    
    useEffect(() => {
        return () => SetIsCancelled(true);
    }, []);

    return {login, error, isPending}
}

export default useLogin
