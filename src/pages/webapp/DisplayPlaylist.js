import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import PlayListCard from './PlayListCard';
import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleUp } from '@fortawesome/free-solid-svg-icons'
import { faArrowCircleDown } from '@fortawesome/free-solid-svg-icons';


const FOLLOWERS_ENDPOINT = "https://api.spotify.com/v1/playlists";

const DisplayPlaylist = (props) => {

    const [dataComplete, setDataComplete] = useState(null);
    const [showlist, setShowList] = useState(false);
    const { user } = useAuthContext();
    const { documents, error } = useCollection('playlists', 'createdAt', ['uid', '==', user.uid], "desc")


    
    useEffect(() => {
        getFollowers();
    }, [props.data]);

    useEffect(() => {
        if (props.showList) {
            ShowList();
        }
    }, [props.showList]);

    function ShowList(){
        props.ParentData(dataComplete);
        setShowList(true);
    }

    const getFollowers = () => {
        let tempFollowers = [];
        props.data.data.items.map(item => {
            axios.get(`${FOLLOWERS_ENDPOINT}/${item.id}`, {
                headers: {
                    Authorization: "Bearer " + props.token,
                },
            })
            .then((res) => {
                tempFollowers.push(res.data);
                
            })
            .catch((error) => {
                console.log(error);
            })
        })
        setDataComplete(tempFollowers);
        // setLoaded(true);
    }

    function CalcDifference(savedDoc, itemName, newTrack, newFollowers, isTrack){

        if(savedDoc[0] != null){
          // console.log(`${savedDoc} ${itemName} ${newTrack} ${newFollowers}`)
            for (let i = 0; i < savedDoc[0].playlist.length; i++) {
                // console.log(newDoc[0])
                if (itemName == savedDoc[0].playlist[i].name) {
                    if (isTrack) {
                      const newVal = parseInt(newTrack)
                      const oldVal = parseInt(savedDoc[0].playlist[i].tracks)
                      const res = newVal - oldVal;
                      return parseInt(res);
                    }else{
                      const newVal = parseInt(newFollowers)
                      const oldVal = parseInt(savedDoc[0].playlist[i].followers)
                      const res = newVal - oldVal;
                      return parseInt(res);
                    }  
                  }
            }
        }
      }

      function CalcArrow(newDoc, itemName, newTrack, newFollowers, isTrack){
        if (newDoc[0] != null) {
            for (let i = 0; i < newDoc[0].playlist.length; i++) {
                if (itemName == newDoc[0].playlist[i].name) {
                  if (isTrack) {
                    const newVal = parseInt(newTrack)
                    const oldVal = parseInt(newDoc[0].playlist[i].tracks)
                    const res = newVal - oldVal;
                    const newColor = AnwserColor(res);
                    return AnwserArrow(newColor);
                  }else{
                    const newVal = parseInt(newFollowers)
                    const oldVal = parseInt(newDoc[0].playlist[i].followers)
                    const res = newVal - oldVal;
                    const newColor = AnwserColor(res);
                    return AnwserArrow(newColor);
                  }  
                }
              }
        }  
      }

      function AnwserArrow(newColor){
        switch (newColor) {
          case "green":
            return <FontAwesomeIcon icon={faArrowCircleUp} style={{color: "green"}}/>;
          case "red":
            return <FontAwesomeIcon icon={faArrowCircleDown} style={{color: "red"}}/>;
          default:
            break;
        }
      }
  
      function AnwserColor(res){
        const resInt = parseInt(res)

        if (resInt > 0) {
          return "green";
        }else if(resInt === 0){
          return "black";
        }else{
          return "red";
        }
      }


  return <>
            {showlist && 
            <div className='playlist-headers'>
                <h3 className='playlist-header-name'>Playlist</h3>
                <h3 className='playlist-header-track'>Tracks</h3>
                <h3 className='playlist-header-followers'>Followers</h3>
            </div>}
            {/* {console.log(documents && documents[0])} */}
            {showlist && dataComplete.map((item, i) => 
                        <PlayListCard key={item.id} background={i % 2 === 0 && "Snow"}>
                            {<img src={item.images[0] && item.images[0].url} alt="" />}
                            {<p className='playlist-name'>{item.name && item.name}</p>}
                            {<p className='playlist-description'>{item.description && item.description}</p>}
                            {item.tracks.total && <div className='playlist-tracks'>
                              <p>{`${item.tracks.total} 
                              T: (${CalcDifference(documents, item.name, item.tracks.total, item.followers.total, true)}) `
                              }</p>
                              <p className='playlist-arrow'>{CalcArrow(documents, item.name, item.tracks.total, item.followers.total, true)}</p>
                            </div>}
                            {<div className='playlist-followers'>
                            {item.followers.total ? 
                            <div className='playlist-followers-div'>
                              <p>{`${item.followers.total.toLocaleString()} 
                              F: (${CalcDifference(documents, item.name, item.tracks.total, item.followers.total, false)}) `}
                              </p>
                              <p className='playlist-arrow'>{CalcArrow(documents, item.name, item.tracks.total, item.followers.total, false)}</p>
                            </div> : 
                            <p>
                              F:0
                            </p>}
                              
                            </div>}
                            
                        </PlayListCard>
                    )}
  </>
// 
}


export default DisplayPlaylist;
