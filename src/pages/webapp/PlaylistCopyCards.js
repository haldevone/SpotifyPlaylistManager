import React from 'react'
import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useEffect } from 'react';
import useFirestore from '../../hooks/useFirestore';
import './PlayListCard.css'
import "./PlaylistCopy.css"

function PlaylistCopyCards({copyButton, data}) {
    const { user } = useAuthContext();
    const { documents, error } = useCollection('listcopy', 'createdAt', ['uid', '==', user.uid]);
    const { deleteDocument } = useFirestore('listcopy');

    // useEffect(() => {

    // }, [documents]);

  return (
    <div>
    <h1>Copy lists</h1>
    {/* {console.log(documents)} */}
        <div className={"listcopy-card-container"}>
            {documents && documents.map((list,i) => {
             return ( <div key={i} className={"listcopy-card"}>
                <div>
                  <div className='listcopy-card-fromTo-flex'>
                    <p className='listcopy-card-fromTo'>From: </p>
                    <p>{list.listCopy.fromCopy.name}</p>
                  </div>
                  <div className='listcopy-card-fromTo-flex'>
                    <p className='listcopy-card-fromTo'>To: </p>
                    <p>{list.listCopy.toCopy.name}</p>
                  </div>
                  <div className='listcopy-card-fromTo-flex'>
                    <p className='listcopy-card-fromTo'>Mix With: </p>
                    <select className='listcopy-options'>
                    <option className='listcopy-options listcopy-options-select'>{"..."}</option>
                    {data.data.items.map((data, i) => {
                        return (
                            <option key={i} className='listcopy-options'>{data.name}</option>
                        )
                    })}
                    </select>
                    
                  </div>
                </div>
                <button className='btn-form' onClick={() => copyButton(list.listCopy.fromCopy.playlistId, list.listCopy.toCopy.playlistId)} style={{marginLeft:"1.5rem"}}>COPY</button>
                <div style={{position:"relative"}}>
                  <button className='btn-copy' onClick={() => deleteDocument(list.id)}>x</button>
                </div>
              </div>)
            })}
        </div>
    </div>
  )
}

export default PlaylistCopyCards