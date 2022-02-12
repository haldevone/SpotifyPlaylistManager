import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import PlayListCard from './PlayListCard';
import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';


const FOLLOWERS_ENDPOINT = "https://api.spotify.com/v1/playlists";

const DisplayPlaylist = (props) => {

    const [dataComplete, setDataComplete] = useState(null);
    const [showlist, setShowList] = useState(false);
    const { user } = useAuthContext();
    const { documents, error } = useCollection('playlists', 'createdAt', ['uid', '==', user.uid])


    
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
        // console.log(data);
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

    function CalcDifference(newDoc, itemName, oldTrack, oldFollowers, isTrack){

        if(newDoc[0] != null){
            
            for (let i = 0; i < newDoc[0].playlist.length; i++) {
                console.log(newDoc[0])
                if (itemName == newDoc[0].playlist[i].name) {
                    if (isTrack) {
                      const newVal = parseInt(newDoc[0].playlist[i].tracks)
                      const oldVal = parseInt(oldTrack)
                      const res = newVal - oldVal;
                      return parseInt(res);
                    }else{
                      const newVal = parseInt(newDoc[0].playlist[i].followers)
                      const oldVal = parseInt(oldFollowers)
                      const res = newVal - oldVal;
                      return parseInt(res);
                    }  
                  }
            }
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
                            {<p className='playlist-tracks'>{item.tracks.total && (`${item.tracks.total} 
                             T: (${CalcDifference(documents, item.name, item.tracks.total, item.followers.total, true)})`)}</p>}
                            {<p className='playlist-followers'>{item.followers.total && (`${item.followers.total.toLocaleString()} 
                            F: (${CalcDifference(documents, item.name, item.tracks.total, item.followers.total, false)})`)}</p>}
                        </PlayListCard>
                    )}
  </>
// 
}


export default DisplayPlaylist;
