import React from 'react';
import { useState, useEffect, useImperativeHandle, forewardRef } from 'react';
import axios from 'axios';
import PlayListCard from './PlayListCard';


const FOLLOWERS_ENDPOINT = "https://api.spotify.com/v1/playlists";

const DisplayPlaylist = (props) => {

    const [dataComplete, setDataComplete] = useState(null);
    const [showlist, setShowList] = useState(false);

    
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


  return <>
            {showlist && 
            <div className='playlist-headers'>
                <h3 className='playlist-header-name'>Playlist</h3>
                <h3 className='playlist-header-track'>Tracks</h3>
                <h3 className='playlist-header-followers'>Followers</h3>
            </div>}
            {showlist && dataComplete.map((item, i) => 
                        <PlayListCard key={item.id} background={i % 2 === 0 && "Snow"}>
                        <img src={item.images[0].url} alt="" />
                            <p className='playlist-name'>{item.name}</p>
                            <p className='playlist-description'>{item.description}</p>
                            <p className='playlist-tracks'>{item.tracks.total}</p>
                            <p className='playlist-followers'>{item.followers.total.toLocaleString()}</p>
                        </PlayListCard>
                    )}
  </>
     
}


export default DisplayPlaylist;
