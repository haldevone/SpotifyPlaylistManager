import Message from './Message';
import useFirestore from '../../hooks/useFirestore';
import React, { useRef, useState, useEffect } from 'react'
import './PlayListCard.css'
import "./PlaylistCopy.css"


function PlayListCopyCard({indexPlace, id, copyButton, data, listItem, copyComplete}) {
    const { deleteDocument } = useFirestore('listcopy');
    const [copyMessage, setCopyMessage] = useState(false);

    useEffect(() => {
      if (copyComplete == id) {
        setCopyMessage(true);
      }
    }, [copyComplete])
    

    return <div className={"listcopy-card"}>
    <div style={{position:"relative"}}>
         <button className='btn-copy' onClick={() => deleteDocument(listItem.id)}>x</button>
    </div>
    <div className='listcopy-card-head-info'>
      <p className='listcopy-card-nr'>{indexPlace +1}</p>
      <div className='listcopy-card-message'>{copyMessage && <Message note={"Copy Complete"}/>}</div>
    </div>
       <div className='listcopy-card-inner'>
         <div className='listcopy-card-fromTo-div'>
           <p>From: </p>
           <p className='listcopy-card-fromTo'>{listItem.listCopy.fromCopy.name}</p>
         </div>
         <div className='listcopy-card-fromTo-div'>
           <p>To: </p>
           <p className='listcopy-card-fromTo'>{listItem.listCopy.toCopy.name}</p>
         </div>
         <div className='listcopy-card-fromTo-div'>
           <p>Mix With: </p>
           <p className='listcopy-card-fromTo'>{listItem.listCopy.mixWith.name}</p>
         </div>
         <div className='listcopy-card-maxSongs-div'>
           <p className='listcopy-card-maxSongs'>{`Max songs: ${listItem.listCopy.maxSongs}`}</p>
         </div>
         <div className='listcopy-card-nrSongsBetween-div'>
           <p className='listcopy-card-nrSongsBetween'>{`Nr Songs Between: ${listItem.listCopy.nrSongsBetween}`}</p>
         </div>
         <button className={copyMessage ? "btn-form-disabled" : "btn-form"} 
         onClick={() => copyButton(listItem.listCopy.fromCopy.playlistId, listItem.listCopy.toCopy.playlistId, listItem.listCopy.mixWith.playlistId, listItem.listCopy.maxSongs, listItem.listCopy.nrSongsBetween, id)}
         disabled={copyMessage}>Copy</button>
       </div>
     </div>
}

export default PlayListCopyCard