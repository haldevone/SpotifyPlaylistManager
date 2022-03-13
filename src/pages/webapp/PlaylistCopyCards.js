import React, { useRef, useState } from 'react'
import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useEffect } from 'react';
import useFirestore from '../../hooks/useFirestore';
import './PlayListCard.css'
import "./PlaylistCopy.css"
import Message from './Message';

function PlaylistCopyCards({copyButton, data, copyComplete}) {
    const { user } = useAuthContext();
    const { documents, error } = useCollection('listcopy', 'createdAt', ['uid', '==', user.uid]);
    const { deleteDocument } = useFirestore('listcopy');
    const [showMessage, setShowMessage] = useState(false);
    
    const cardId = useRef();

    function copyComplete(){
      console.log(copyComplete)
      if (copyComplete.complete) {
        setShowMessage(true)
      }
    }

  return (
    <div>
    <h1>Copy lists</h1>
    {/* {console.log(documents)} */}
        <div className={"listcopy-card-container"}>
        {/* {copyComplete => copyComplete()} */}
            {documents && documents.map((list,i) => {
              cardId.current = i;
             return ( <div key={i} className={"listcopy-card"}>
             <div style={{position:"relative"}}>
                  <button className='btn-copy' onClick={() => deleteDocument(list.id)}>x</button>
                </div>
             <div className='listcopy-card-head-info'>
               <p className='listcopy-card-nr'>{i+1}</p>
               <div className='listcopy-card-message'>{showMessage && <Message note={"Copy Complete"}/>}</div>
             </div>
                <div className='listcopy-card-inner'>
                  <div className='listcopy-card-fromTo-div'>
                    <p>From: </p>
                    <p className='listcopy-card-fromTo'>{list.listCopy.fromCopy.name}</p>
                  </div>
                  <div className='listcopy-card-fromTo-div'>
                    <p>To: </p>
                    <p className='listcopy-card-fromTo'>{list.listCopy.toCopy.name}</p>
                  </div>
                  <div className='listcopy-card-fromTo-div'>
                    <p>Mix With: </p>
                    <select className='listcopy-options'>
                    <option className='listcopy-options listcopy-options-select'>{"..."}</option>
                    {data.data.items.map((data, i) => {
                        return (
                            <option key={i} className='listcopy-options'>{data.name}</option>
                        )
                    })}
                    </select>
                  </div>
                  <button className='btn-form' onClick={() => copyButton(list.listCopy.fromCopy.playlistId, list.listCopy.toCopy.playlistId, cardId.current)}>Copy</button>
                </div>
              </div>)
            })}
        </div>
    </div>
  )
}

export default PlaylistCopyCards