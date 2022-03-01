import React, { useState, useEffect } from 'react'
import "./PlaylistCopy.css"
import "../../pages/../index.css"
import useFirestore from '../../hooks/useFirestore';
import { Timestamp } from 'firebase/firestore';
import { useAuthContext } from '../../hooks/useAuthContext';
import './PlayListCard.css'
import PlaylistCopyDisplay from './PlaylistCopyDisplay';
import axios from 'axios';


function PlaylistCopy(props) {
    const [fromCopy, setFromCopy] = useState();
    const [toCopy, setToCopy] = useState();
    const {addDocument, response} = useFirestore('listcopy');
    const { user } = useAuthContext();

    function handleChangeFROM(e){
        // console.log(e.target.value);
        setFromCopy(e.target.value);
    }

    function handleChangeTO(e){
        // console.log(e.target.value);
        setToCopy(e.target.value);
    }

    function saveToDataBase(){
        const createdAt = Timestamp.fromDate(new Date()).toDate();

        if (fromCopy != undefined && toCopy != undefined) {
            addDocument({
                uid: user.uid,
                listCopy: {fromCopy, toCopy},
                createdAt
            });
        }
        setToCopy("");
        setFromCopy("");
    }

    const getPlaylist = () => {
        props.data.data.items.map(item => {
            axios.get(`https://api.spotify.com/v1/playlists/${item.id}/tracks`, {
                headers: {
                    Authorization: "Bearer " + props.token,
                },
            })
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.log(error);
            })
        })
    }

    useEffect(() => {
        getPlaylist();
    }, [response])

  return (
    <div>
            {response.success && <p className='playlist-message'>Saved To Database!</p>}
        <div className='listcopy'>
            <div className='listcopy-item padding-top-2'>
                <label>Select copy FROM: </label>
                <select className='listcopy-options' onChange={(e) => handleChangeFROM(e)} value={fromCopy}>
                <option className='listcopy-options listcopy-options-select' >{"Select From..."}</option>
                    {props.data.data.items.map((data, i) => {
                        return (
                            <option key={i} className='listcopy-options'>{data.name}</option>
                        )
                    })}
                </select>
            </div>
            <div className='listcopy-item'>
                <label>Select copy TO: </label>
                <select className='listcopy-options' onChange={(e) => handleChangeTO(e)} value={toCopy}>
                <option className='listcopy-options listcopy-options-select' >{"Select To..."}</option>
                    {props.data.data.items.map((data, i) => {
                        return (
                            <option key={i} className='listcopy-options'>{data.name}</option>
                        )
                    })}
                </select>
            </div>
            <div className='center margin-top-2'>
                <button className='btn-form' onClick={()=> saveToDataBase()}>Save To DB</button>
            </div>
        </div>
        <PlaylistCopyDisplay />
    </div>
  )
}

export default PlaylistCopy