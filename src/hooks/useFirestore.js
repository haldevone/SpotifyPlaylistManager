import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useReducer, useState } from "react";
import { db } from "../firebase/config";


let initailState = {
    document: null,
    isPending: false,
    error: null,
    success: null
}

const firestoreReducer = (state, action) => {
    switch (action.type) {
        case 'IS_PENDING':
            return{isPending:true , document: null, success:false , error: null}
        case 'ADDED_DOCUMENT':
            return{isPending:false , document: action.payload, success:true , error: null}
        case 'DELETED_DOCUMENT':
            return{isPending:false , document: null, success:true , error: null}
        case 'ERROR':
            return{isPending:false , document: null, success:true , error: action.payload}
        default:
        return state;
    }
}

const useFirestore = (collectionName) => {
    const [response, dispatch] = useReducer(firestoreReducer, initailState);
    const [isCancelled, setIsCancelled] = useState(false);

    const collectionRef = collection(db, collectionName);

    const dispatchIfNotCancelled = (action) => {
        if (!isCancelled) {
            dispatch(action);
        }
    }

    const addDocument = async(doc) => {
        dispatch({type: 'IS_PENDING'});

        try {
            const docRef = addDoc(collectionRef, doc);
            const addedDocument = await docRef.add({ ...doc});
            dispatchIfNotCancelled({type: 'ADDED_DOCUMENT', payload: addedDocument});
        } catch (err) {
            dispatchIfNotCancelled({type: 'ERROR', payload: err.message});
        }
    }

    const deleteDocument = async (id) => {
        dispatch({type: 'IS_PENDING'});

        try {
            await deleteDoc(doc(db, collectionName, (id)));
            dispatchIfNotCancelled({type: 'DELETED_DOCUMENT'});
        } catch (err) {
            dispatchIfNotCancelled({type: 'ERROR', payload: 'Could Not Delete!'});
        }
    }

    useEffect(() => {
        return () => {
            setIsCancelled(true);
        }
    }, []);

    return {addDocument, deleteDocument, response}
}

export default useFirestore