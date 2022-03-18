import Message from './Message';
import useFirestore from '../../hooks/useFirestore';
import React, { useRef, useState, useEffect } from 'react'
import './PlayListCard.css'
import "./PlaylistCopy.css"


function PlayListCopyCard({id, copyButton, data, listItem, copyComplete}) {
    const { deleteDocument } = useFirestore('listcopy');
    const [mixWith, setMixWith] = useState({name: "", playlistId: ""});
    const [copyMessage, setCopyMessage] = useState(false);

    const cardId = useRef();
    useEffect(() => {
      cardId.current = id
      if (copyComplete == cardId.current) {
        setCopyMessage(true);
      }
    }, [copyComplete])
    

    function handleChangeMix(e){
        console.log(e.target.value);
        setMixWith({name: e.target.value, playlistId: findID(e.target.value)});
    }

    function findID(name){
        if (name == "...") {
          return
        }
        let foundPlaylist = data.data.items.filter(item => {
            return item.name == name;
        })
        return foundPlaylist[0].id;
    }

    return <div className={"listcopy-card"}>
    <div style={{position:"relative"}}>
         <button className='btn-copy' onClick={() => deleteDocument(listItem.id)}>x</button>
    </div>
    <div className='listcopy-card-head-info'>
      <p className='listcopy-card-nr'>{id}</p>
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
           <select className='listcopy-options' value={mixWith.name} onChange={(e) => handleChangeMix(e)} >
           <option className='listcopy-options listcopy-options-select'>{"..."}</option>
           {data.data.items.map((data, i) => {
               return (
                   <option key={i} className='listcopy-options'>{data.name}</option>
               )
           })}
           </select>
         </div>
         <button className={copyMessage ? "btn-form-disabled" : "btn-form"} 
         onClick={() => copyButton(listItem.listCopy.fromCopy.playlistId, listItem.listCopy.toCopy.playlistId, mixWith.playlistId, cardId.current)}
         disabled={copyMessage}>Copy</button>
       </div>
     </div>
}

export default PlayListCopyCard