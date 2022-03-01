import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { useRef } from 'react';

export const useCollection = (collectionName, createdAt, _q) => {

    const[documents, setDocuments] = useState(null);
    const [error, setError] = useState(null);
    const q = useRef(_q).current;

    useEffect(() => {
        let refColl = collection(db, collectionName);
        if (q) {
            refColl = query(refColl, where(...q), orderBy(createdAt, "desc")); //You can add limit here
        }

        const unsubscribe = onSnapshot(refColl, (snapshot) => {
            let results = [];
            snapshot.docs.forEach((doc) => {
                results.push({...doc.data(), id: doc.id})})
                
                setDocuments(results);
                setError(null);
        }, (err) => {
            setError('Could not fetch the data');
            console.log(err);
        });

        return () => {unsubscribe()
        }
    }, [q]);

    return {documents, error}
}

