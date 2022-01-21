
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { useAuthContext } from './useAuthContext';


function useLogout() {
    const[isCancelled, setIsCancelled] = useState(false);
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const { dispatch } = useAuthContext();

    const logout = async () => {
        setError(null);
        setIsPending(true);

        try {
            await auth.signOut();

            //dispatch logut action
            dispatch({type: 'LOGOUT'});

            if (!isCancelled) {
                setError(null);
                setIsPending(false);
            }
            
        } catch (err) {
            if (!isCancelled) {
                console.log(err.message);
                setError(err.message);
                setIsPending(false);
            }
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, []);

    return {logout, error, isPending}
}

export default useLogout
