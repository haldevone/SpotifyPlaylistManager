import React, { useState, useEffect } from 'react'
import "./PlaylistCopy.css"
import "../../pages/../index.css"
import useFirestore from '../../hooks/useFirestore';
import { Timestamp } from 'firebase/firestore';
import { useAuthContext } from '../../hooks/useAuthContext';
import './PlayListCard.css'
import PlaylistCopyCards from './PlaylistCopyCards';
import axios from 'axios';


function PlaylistCopy(props) {
    const [fromCopy, setFromCopy] = useState({name: "", playlistId: ""});
    const [toCopy, setToCopy] = useState({name: "", playlistId: ""});
    const {addDocument, response} = useFirestore('listcopy');
    const { user } = useAuthContext();
    // const [message, setMessage] = useState(false);


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

    const copyButton = (playlistFrom, playlistTo) => {
        const token = props.token
        const data = {limit: 40}
        axios.all([
            axios.get(`https://api.spotify.com/v1/playlists/${playlistFrom}/tracks`, {
                headers: {
                    Authorization: "Bearer " + token,
                },
                // data: {
                //     limit: 50
                // }
            },data),
            axios.get(`https://api.spotify.com/v1/playlists/${playlistTo}/tracks`, {
                headers: {
                    Authorization: "Bearer " + token,
                }
            })
        ])
            .then((res) => {
                console.log(res[0]);
                axios.delete(`https://api.spotify.com/v1/playlists/${playlistTo}/tracks`, {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                    data: {
                        tracks: tracksArrayDelete(res[1])
                        // tracks: [{uri: "spotify:track:77z6mJeFcHlRWVfbOdBCtc"}] Example removing one track
                    }
                })
                .then((res2) => {
                    // console.log(res[1])
                    const newData = {
                        uris: tracksArrayCopy(res[0])
                    }
                    axios.post(`https://api.spotify.com/v1/playlists/${playlistTo}/tracks`, newData, {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                        
                    }).then((res3) => {
                        // console.log(res3);
                    }) .catch((error) => {
                        console.log(error);
                    })
                    // console.log(res[0]);
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    function tracksArrayDelete(inputData){
        let totI = 0;
        let totalTracks = [{uri:""}]
        totalTracks =  inputData.data.items.map( (item, i) => {
            totI = i;
            return {uri : item.track.uri}
        })
        console.log(totI);
        return totalTracks
    }

    function tracksArrayCopy(inputData){
        
        let totalTracks = []
        totalTracks =  inputData.data.items.map( (item, i) => {
            return item.track.uri
        })
        // console.log(totalTracks);
        return totalTracks
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
        <PlaylistCopyCards copyButton={copyButton} data={props.data}/>
    </div>
  )
}

export default PlaylistCopy