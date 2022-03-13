import React, { useState, useEffect } from 'react'
import "./PlaylistCopy.css"
import "../../pages/../index.css"
import useFirestore from '../../hooks/useFirestore';
import { Timestamp } from 'firebase/firestore';
import { useAuthContext } from '../../hooks/useAuthContext';
import './PlayListCard.css'
import PlaylistCopyCards from './PlaylistCopyCards';
import axios from 'axios';


function PlaylistCopy(props) {
    const [fromCopy, setFromCopy] = useState({name: "", playlistId: ""});
    const [toCopy, setToCopy] = useState({name: "", playlistId: ""});
    const {addDocument, response} = useFirestore('listcopy');
    const { user } = useAuthContext();
    const [copyComplete, setCopycomplete] = useState(false);


    function handleChangeFROM(e){
        console.log(e.target.value);
        setFromCopy({name: e.target.value, playlistId: findID(e.target.value)});
    }

    function handleChangeTO(e){
        
        setToCopy({name: e.target.value, playlistId: findID(e.target.value)});
    }

    function findID(name){
        let foundPlaylist = props.data.data.items.filter(item => {
            return item.name == name;
        })
        return foundPlaylist[0].id;
    }

    function saveToDataBase(){
        const createdAt = Timestamp.fromDate(new Date()).toDate();

        if (fromCopy != undefined && toCopy != undefined) {
            addDocument({
                uid: user.uid,
                listCopy: {fromCopy, toCopy},
                createdAt
            });
        }
        setToCopy("");
        setFromCopy("");
    }

    function copyButton(playlistFrom, playlistTo, cardId){
        console.log("Deleting...")
        const token = props.token;
        const getURL = `https://api.spotify.com/v1/playlists/${playlistTo}/tracks`;
        //DELETE TO FOLDER
        axios.get(getURL, {
            headers: {
                Authorization: "Bearer " + token,
            }
        }).then((res) => {
            //Delete 0-100
            console.log("Deleting 100")
            console.log(res);
            axios.delete(getURL, {
                headers: {
                    Authorization: "Bearer " + token,
                },
                data: {
                    tracks: tracksArrayDelete(res)
                }
            }).then((resDel) => {
                if(res.data.next == null){
                    copyTo(playlistFrom, playlistTo);
                    return
                }
                axios.get(getURL, {
                headers: {
                    Authorization: "Bearer " + token,
                }
                }).then((res2) => {
                    //Delete 100-200
                    console.log("Deleting 200")
                    axios.delete(getURL, {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                        data: {
                            tracks: tracksArrayDelete(res2)
                        }
                    }).then((resDel2) => {
                        if (res2.data.next == null){
                            copyTo(playlistFrom, playlistTo);
                            return
                        } 
                        axios.get(getURL, {
                            headers: {
                                Authorization: "Bearer " + token,
                            }
                        }).then((res3) => {
                            //Delete 200-300
                            console.log("Deleting 300")
                            axios.delete(getURL, {
                                headers: {
                                    Authorization: "Bearer " + token,
                                },
                                data: {
                                    tracks: tracksArrayDelete(res3)
                                }
                            }).then((resDel3) => {
                                if (res3.data.next == null){
                                    copyTo(playlistFrom, playlistTo);
                                    return
                                } 
                                axios.get(getURL, {
                                    headers: {
                                        Authorization: "Bearer " + token,
                                    }
                                }).then((res4) => {
                                    //Delete 300-400
                                    console.log("Deleting 400")
                                    axios.delete(getURL, {
                                        headers: {
                                            Authorization: "Bearer " + token,
                                        },
                                        data: {
                                            tracks: tracksArrayDelete(res4)
                                        }
                                    }).then((resDel4) => {
                                        if (res4.data.next == null){
                                            copyTo(playlistFrom, playlistTo);
                                            return
                                        } 
                                        axios.get(getURL, {
                                            headers: {
                                                Authorization: "Bearer " + token,
                                            }
                                        }).then((res5) => {
                                            //Delete 400-500
                                            console.log("Deleting 500")
                                            axios.delete(getURL, {
                                                headers: {
                                                    Authorization: "Bearer " + token,
                                                },
                                                data: {
                                                    tracks: tracksArrayDelete(res5)
                                                }
                                            }).then((resDel5) => {
                                                if (res5.data.next == null){
                                                    copyTo(playlistFrom, playlistTo);
                                                    return
                                                }
                                                axios.get(getURL, {
                                                    headers: {
                                                        Authorization: "Bearer " + token,
                                                    }
                                                }).then((res6) => {
                                                    //Delete 500-600
                                                    console.log("Deleting 600")
                                                    axios.delete(getURL, {
                                                        headers: {
                                                            Authorization: "Bearer " + token,
                                                        },
                                                        data: {
                                                            tracks: tracksArrayDelete(res6)
                                                        }
                                                    }).then((resDel6) =>{
                                                        copyTo(playlistFrom, playlistTo);
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
            
        }) .catch((error) => {
            console.log(error);
        })
    }

    function copyTo(playlistFrom, playlistTo){
        //COPY STARTS HERE
        console.log("Posting...");
        const token = props.token;
        axios.get(`https://api.spotify.com/v1/playlists/${playlistFrom}/tracks`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        }).then((resGet) => {
            console.log("Post 100");
            const newData = {uris: tracksArrayCopy(resGet)}
            axios.post(`https://api.spotify.com/v1/playlists/${playlistTo}/tracks`, newData, {
                headers: {
                    Authorization: "Bearer " + token,
                }
            }).then((resPost) => {
                if (resGet.data.next == null) return 
                axios.get(resGet.data.next, {
                    headers: {
                        Authorization: "Bearer " + token,
                    }
                }).then((resGet2) => {
                    console.log("Post 200");
                    const newData = {uris: tracksArrayCopy(resGet2)}
                    axios.post(`https://api.spotify.com/v1/playlists/${playlistTo}/tracks`, newData, {
                        headers: {
                            Authorization: "Bearer " + token,
                        }
                    }).then((resPost2) => {
                        if (resGet2.data.next == null) return
                        axios.get(resGet2.data.next, {
                            headers: {
                                Authorization: "Bearer " + token,
                            }
                        }).then((resGet3) => {
                            console.log("Post 300");
                            const newData = {uris: tracksArrayCopy(resGet3)}
                            axios.post(`https://api.spotify.com/v1/playlists/${playlistTo}/tracks`, newData, {
                                headers: {
                                    Authorization: "Bearer " + token,
                                }
                            }).then((resPost3) => {
                                if (resGet3.data.next == null) return
                                axios.get(resGet3.data.next, {
                                    headers: {
                                        Authorization: "Bearer " + token,
                                    }
                                }).then((resGet4) => {
                                    console.log("Post 400");
                                    const newData = {uris: tracksArrayCopy(resGet4)}
                                    axios.post(`https://api.spotify.com/v1/playlists/${playlistTo}/tracks`, newData, {
                                        headers: {
                                            Authorization: "Bearer " + token,
                                        }
                                    }).then((resPost4) => {
                                        if (resGet4.data.next == null) return
                                        axios.get(resGet4.data.next, {
                                            headers: {
                                                Authorization: "Bearer " + token,
                                            }
                                        }).then((resGet5) => {
                                            console.log("Post 500");
                                            const newData = {uris: tracksArrayCopy(resGet5)}
                                            axios.post(`https://api.spotify.com/v1/playlists/${playlistTo}/tracks`, newData, {
                                                headers: {
                                                    Authorization: "Bearer " + token,
                                                }
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
        //COPY COMPLETE
        setCopycomplete(true);
    }

    // const copyButtonX = (playlistFrom, playlistTo) => {
    //     const token = props.token
    //     const data = {limit: 40}
    //     axios.all([
    //         axios.get(`https://api.spotify.com/v1/playlists/${playlistFrom}/tracks`, {
    //             headers: {
    //                 Authorization: "Bearer " + token,
    //             },
    //             // data: {
    //             //     limit: 50
    //             // }
    //         },data),
    //         axios.get(`https://api.spotify.com/v1/playlists/${playlistTo}/tracks`, {
    //             headers: {
    //                 Authorization: "Bearer " + token,
    //             }
    //         })
    //     ])
    //         .then((res) => {
    //             console.log(res[0]);
    //             axios.delete(`https://api.spotify.com/v1/playlists/${playlistTo}/tracks`, {
    //                 headers: {
    //                     Authorization: "Bearer " + token,
    //                 },
    //                 data: {
    //                     tracks: tracksArrayDelete(res[1])
    //                     // tracks: [{uri: "spotify:track:77z6mJeFcHlRWVfbOdBCtc"}] Example removing one track
    //                 }
    //             })
    //             .then((res2) => {
    //                 // console.log(res[1])
    //                 const newData = {
    //                     uris: tracksArrayCopy(res[0])
    //                 }
    //                 axios.post(`https://api.spotify.com/v1/playlists/${playlistTo}/tracks`, newData, {
    //                     headers: {
    //                         Authorization: "Bearer " + token,
    //                     },
                        
    //                 }).then((res3) => {
    //                     // console.log(res3);
    //                 }) .catch((error) => {
    //                     console.log(error);
    //                 })
    //                 // console.log(res[0]);
    //             })
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         })
    // }

    function tracksArrayDelete(inputData){
        // console.log(inputData);
        let totI = 0;
        let totalTracks = [{uri:""}]
        totalTracks =  inputData.data.items.map( (item, i) => {
            totI = i;
            return {uri : item.track.uri}
        })
        // console.log(totI);
        return totalTracks
    }

    function tracksArrayCopy(inputData){
        
        let totalTracks = []
        totalTracks =  inputData.data.items.map( (item, i) => {
            return item.track.uri
        })
        // console.log(totalTracks);
        return totalTracks
    }


  return (
    <div>
            {response.success && <p className='playlist-message'>Saved To Database!</p>}
        <div className='listcopy'>
            <div className='listcopy-item'>
                <label>Select Copy From: </label>
                <select className='listcopy-options' onChange={(e) => handleChangeFROM(e)} value={fromCopy.name}>
                <option className='listcopy-options listcopy-options-select' >{"Select From..."}</option>
                    {props.data.data.items.map((data, i) => {
                        return (
                            <option key={i} className='listcopy-options'>{data.name}</option>
                        )
                    })}
                </select>
            </div>
            <div className='listcopy-item'>
                <label>Select Copt To: </label>
                <select className='listcopy-options' onChange={(e) => handleChangeTO(e)} value={toCopy.name}>
                <option className='listcopy-options listcopy-options-select' >{"Select To..."}</option>
                    {props.data.data.items.map((data, i) => {
                        return (
                            <option key={i} className='listcopy-options'>{data.name}</option>
                        )
                    })}
                </select>
            </div>
            <div className='listcopy-item-btn'>
                <button className='btn-form' onClick={()=> saveToDataBase()}>Save To DB</button>
            </div>
        </div>
        <PlaylistCopyCards copyButton={copyButton} data={props.data} copyComplete={copyComplete}/>
    </div>
  )
}

export default PlaylistCopy