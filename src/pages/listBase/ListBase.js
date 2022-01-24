import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../../components/Navbar';
import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';
import './listBase.css' 


function ListBase(props) {
    const { user } = useAuthContext();
    const { documents, error } = useCollection('playlists', 'createdAt', ['uid', '==', user.uid])
    const calcColor = useRef("black");

    useEffect(() => {

    },[documents]);

    useEffect(() => {

    },[props.dataComplete]);

  
    function CalcDifference(newDoc, itemName, oldTrack, oldFollowers, isTrack){
      for (let i = 0; i < newDoc.length; i++) {

        if (itemName == newDoc[i].name) {
          if (isTrack) {
            const newVal = parseInt(newDoc[i].tracks.total)
            const oldVal = parseInt(oldTrack)
            const res = newVal - oldVal;
            AnwserColor(res);
            return res;
          }else{
            const newVal = parseInt(newDoc[i].followers.total)
            const oldVal = parseInt(oldFollowers)
            const res = newVal - oldVal;
            AnwserColor(res);
            return res;
          }  
        }
      }
    }

    function AnwserColor(res){
      if (res > 0) {
        calcColor.current = "green";
      }else if(res == 0){
        calcColor.current = "black";
      }else{
        calcColor.current = "red";
      }
    }

  return <div>
      <Navbar />
      <h1>Database</h1>
          {(documents && props.dataComplete) && documents.map((items, index) => {
            return (<div className='listbase-list-container'  key={Math.random() * 10000000}>
              <div>
                <h4>List: {index}</h4>
                <h4>Date: {items.createdAt.seconds}</h4>
                {/* {console.log(props.dataComplete)}
                {console.log(documents)} */}
              </div>
              <ul className='listbase-list'>
              {items.playlist.map(item => (
                <li className='listbase-item' key={Math.random() * 10000000}>
                  <p className='listbase-item-name'><span>N: </span>{item.name}</p>
                  <p className='listbase-item-track' style={{color: calcColor.current}}><span>T: </span>
                  {`${item.tracks} (${CalcDifference(props.dataComplete, item.name, item.tracks, item.followers, true)})`}</p>
                  <p className='listbase-item-followers'><span>F: </span>
                  {`${item.followers} (${CalcDifference(props.dataComplete, item.name, item.tracks, item.followers, false)})`}</p>
                </li>
              ))}
            </ul>
            </div>
           )
          })}
  </div>;
}

export default ListBase;
