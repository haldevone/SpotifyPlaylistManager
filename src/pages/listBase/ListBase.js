import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';
import './listBase.css' 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleUp } from '@fortawesome/free-solid-svg-icons'
import { faArrowCircleDown } from '@fortawesome/free-solid-svg-icons';
import useFirestore from '../../hooks/useFirestore';


function ListBase(props) {
    const { user } = useAuthContext();
    const { documents, error } = useCollection('playlists', 'createdAt', ['uid', '==', user.uid], "desc")
    const { deleteDocument } = useFirestore('playlists');

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
            return res;
          }else{
            const newVal = parseInt(newDoc[i].followers.total)
            const oldVal = parseInt(oldFollowers)
            const res = newVal - oldVal;
            return res;
          }  
        }
      }
    }

    function CalcColor(newDoc, itemName, oldTrack, oldFollowers, isTrack){
      for (let i = 0; i < newDoc.length; i++) {

        if (itemName == newDoc[i].name) {
          if (isTrack) {
            const newVal = parseInt(newDoc[i].tracks.total)
            const oldVal = parseInt(oldTrack)
            const res = newVal - oldVal;
            const newColor = AnwserColor(res);
            return newColor;
          }else{
            const newVal = parseInt(newDoc[i].followers.total)
            const oldVal = parseInt(oldFollowers)
            const res = newVal - oldVal;
            const newColor = AnwserColor(res);
            return newColor;
          }  
        }
      }
    }

    function CalcArrow(newDoc, itemName, oldTrack, oldFollowers, isTrack){
      for (let i = 0; i < newDoc.length; i++) {

        if (itemName == newDoc[i].name) {
          if (isTrack) {
            const newVal = parseInt(newDoc[i].tracks.total)
            const oldVal = parseInt(oldTrack)
            const res = newVal - oldVal;
            const newColor = AnwserColor(res);
            return AnwserArrow(newColor);
          }else{
            const newVal = parseInt(newDoc[i].followers.total)
            const oldVal = parseInt(oldFollowers)
            const res = newVal - oldVal;
            const newColor = AnwserColor(res);
            return AnwserArrow(newColor);
          }  
        }
      }
    }

    function AnwserArrow(newColor){
      switch (newColor) {
        case "green":
          return <FontAwesomeIcon icon={faArrowCircleUp} />;
        case "red":
          return <FontAwesomeIcon icon={faArrowCircleDown} />;
        default:
          break;
      }
    }

    function AnwserColor(res){
      if (res > 0) {
        return "green";
      }else if(res == 0){
        return "black";
      }else{
        return "red";
      }
    }

  return <div className='playlist-result'>
      <h1 className='header'>Database</h1>
          {(documents && props.dataComplete) && documents.map((items, index) => {
            return (<div className='listbase-list-container' key={Math.random() * 10000000}>
              <div className='listbase-top'>
                  <h4 >List: {index + 1 }</h4>
                  <h4 className='listbase-date'>Date: {items.createdAt.toDate().toLocaleDateString('en')}</h4>
                  <button className='listbase-btn' onClick={() => deleteDocument(items.id)}>x</button>
              </div>

              <ul className='listbase-list'>
              {items.playlist.map(item => (
                <li className='listbase-item' key={Math.random() * 10000000}>
                  <p className='listbase-item-name'>{item.name}</p>
                  <p className='listbase-item-track' style={{color: CalcColor(props.dataComplete, item.name, item.tracks, item.followers, true)}}>
                    <span>T: </span>
                  {`${item.tracks} (${CalcDifference(props.dataComplete, item.name, item.tracks, item.followers, true)}) `}
                  {CalcArrow(props.dataComplete, item.name, item.tracks, item.followers, true)}
                  </p>
                  <p className='listbase-item-followers' style={{color: CalcColor(props.dataComplete, item.name, item.tracks, item.followers, false)}}>
                    <span>F: </span>
                  {`${item.followers.toLocaleString()} (${CalcDifference(props.dataComplete, item.name, item.tracks, item.followers, false)})`}
                  {CalcArrow(props.dataComplete, item.name, item.tracks, item.followers, false)}
                  </p>
                </li>
              ))}
            </ul>
            </div> 
           )
          })}
  </div>;
}

export default ListBase;
