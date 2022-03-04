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
    const [fromCopy, setFromCopy] = useState({name: "", playlistId: ""});
    const [toCopy, setToCopy] = useState({name: "", playlistId: ""});
    const {addDocument, response} = useFirestore('listcopy');
    const { user } = useAuthContext();

    function handleChangeFROM(e){
        console.log(e.target.value);
        setFromCopy({name: e.target.value, playlistId: findID(e.target.value)});
    }

    function handleChangeTO(e){
        
        setToCopy({name: e.target.value, playlistId: findID(e.target.value)});
    }

    function findID(name){
        let foundPlaylist = props.data.data.items.filter(item => {
            return item.name == name;
        })
        return foundPlaylist[0].id;
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

    const getTracks = (playlistFrom) => {
        axios.get(`https://api.spotify.com/v1/playlists/${playlistFrom}/tracks`, {
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
    }

    const deleteTracks = (playlistFrom) => {
        axios.delete(`https://api.spotify.com/v1/playlists/${playlistFrom}/tracks`, {
                headers: {
                    Authorization: "Bearer " + props.token,
                    'Content-Type': [{uri: "spotify:track:4KxCY17B9zHKVRn1jeVmVX"}],
                },
            })
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.log(error);
            })
    }


  return (
    <div>
            {response.success && <p className='playlist-message'>Saved To Database!</p>}
        <div className='listcopy'>
            <div className='listcopy-item padding-top-2'>
                <label>Select copy FROM: </label>
                <select className='listcopy-options' onChange={(e) => handleChangeFROM(e)} value={fromCopy.name}>
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
                <select className='listcopy-options' onChange={(e) => handleChangeTO(e)} value={toCopy.name}>
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
        <PlaylistCopyDisplay deleteTracks={deleteTracks}/>
    </div>
  )
}

export default PlaylistCopy