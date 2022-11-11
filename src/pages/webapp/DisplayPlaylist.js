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
    }

    function CalcDifference(savedDoc, itemName, newTrack, newFollowers, isTrack){

        if(savedDoc[0] != null){
            for (let i = 0; i < savedDoc[0].playlist.length; i++) {
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


  return <div className='playlist-result'>
          <h1 className='header'>My Playlist</h1>
          <table className='playlist-table'>
            {showlist && 
            <thead className='playlist-headers'>
                <th className=''>#</th>
                <th className=''>Playlist</th>
                <th className=''>Description</th>
                <th className=''>Tracks</th>
                <th className=''>Followers</th>
            </thead>}
            <tbody>
            {showlist && dataComplete.map((item, i) => 
                        <PlayListCard key={item.id}>
                            <td>{i + 1}</td>
                            <td className='playlist-img-title'>
                              <img src={item.images[0] && item.images[0].url} alt="" />
                              <p className='playlist-name'>{item.name && item.name}</p>
                            </td>
                            <td><p className=''>{item.description && item.description}</p></td>
                            <td>
                              {item.tracks.total && <div className=''>
                                <p>{`${item.tracks.total} 
                                T: (${CalcDifference(documents, item.name, item.tracks.total, item.followers.total, true)}) `
                                }</p>
                                <p className=''>{CalcArrow(documents, item.name, item.tracks.total, item.followers.total, true)}</p>
                              </div>}
                            </td>
                            <td>
                              {<div className=''>
                              {item.followers.total ? 
                              <div className=''>
                                <p>{`${item.followers.total.toLocaleString()} 
                                F: (${CalcDifference(documents, item.name, item.tracks.total, item.followers.total, false)}) `}
                                </p>
                                <p className=''>{CalcArrow(documents, item.name, item.tracks.total, item.followers.total, false)}</p>
                              </div> : 
                              <p>
                                F:0
                              </p>}
                              </div>}
                            </td>   
                        </PlayListCard>
                    )}
                    </tbody>
          </table>
        </div>
}


export default DisplayPlaylist;
