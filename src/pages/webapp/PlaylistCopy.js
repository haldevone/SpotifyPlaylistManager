import React, { useState, useEffect } from 'react'
import "../../pages/../index.css"
import useFirestore from '../../hooks/useFirestore';
import { Timestamp } from 'firebase/firestore';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import './PlayListCard.css'
import "./PlaylistCopy.css"
import axios from 'axios';
import PlayListCopyCard from './PlayListCopyCard';

var tempList = [];


function PlaylistCopy(props) {
    const [fromCopy, setFromCopy] = useState({name: "", playlistId: ""});
    const [toCopy, setToCopy] = useState({name: "", playlistId: ""});
    const [mixWith, setMixWith] = useState({name: "", playlistId: ""});
    const {addDocument, response} = useFirestore('listcopy');
    const { user } = useAuthContext();
    const { documents, error } = useCollection('listcopy', 'createdAt', ['uid', '==', user.uid]);
    const [copyComplete, setCopycomplete] = useState(-1);

    function handleChangeFROM(e){
        console.log(e.target.value);
        setFromCopy({name: e.target.value, playlistId: findID(e.target.value)});
    }

    function handleChangeTO(e){

        setToCopy({name: e.target.value, playlistId: findID(e.target.value)});
    }

    function handleChangeMixWith(e){

        setMixWith({name: e.target.value, playlistId: findID(e.target.value)});
    }

    function findID(name){
        if (name == "...") {
            //Error message must choose
          return
        }
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
                listCopy: {fromCopy, toCopy, mixWith},
                createdAt
            });
        }
        // setToCopy("");
        // setFromCopy("");
        // setMixWith("");
    }

    function copyButton(playlistFrom, playlistTo, playlistMix, cardId){
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
                    copyTo(playlistFrom, playlistTo, playlistMix, cardId);
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
                            copyTo(playlistFrom, playlistTo, playlistMix);
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
                                    copyTo(playlistFrom, playlistTo, playlistMix);
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
                                            copyTo(playlistFrom, playlistTo, playlistMix);
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
                                                    copyTo(playlistFrom, playlistTo, playlistMix);
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
                                                        copyTo(playlistFrom, playlistTo, playlistMix);
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
    // function copyTo(playlistFrom, playlistTo, playlistMix){

    // }

    function copyTo(playlistFrom, playlistTo, playlistMix, cardId){
        //COPY STARTS HERE
        const token = props.token;
        tempList = [] //Reset templist

        axios.get(`https://api.spotify.com/v1/playlists/${playlistFrom}/tracks`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        }).then((resGet) => {
            //Add 100
            tempTotalList(resGet);
            if (resGet.data.next == null){
                //NEXT STEP!!
                if (playlistMix == "" || playlistMix == null) {
                    addNoMix(playlistTo, cardId)
                }else{
                    addMix(playlistMix, playlistTo, cardId)
                }
                return
            }
            axios.get(resGet.data.next, {
                headers: {
                    Authorization: "Bearer " + token,
                }
            }).then((resGet2) => {
                //Add 200
                tempTotalList(resGet2);
                if (resGet2.data.next == null){
                    //NEXT STEP!!
                    if (playlistMix == "" || playlistMix == null) {
                        addNoMix(playlistTo, cardId)
                    }else{
                        addMix(playlistMix, playlistTo, cardId)
                    }
                    return
                }
                axios.get(resGet2.data.next, {
                    headers: {
                        Authorization: "Bearer " + token,
                    }
                }).then((resGet3) => {
                    //Add 300
                    tempTotalList(resGet3);
                    if (resGet3.data.next == null){
                        //NEXT STEP!!
                        if (playlistMix == "" || playlistMix == null) {
                            addNoMix(playlistTo, cardId)
                        }else{
                            addMix(playlistMix, playlistTo, cardId)
                        }
                        return
                    }
                    axios.get(resGet3.data.next, {
                        headers: {
                            Authorization: "Bearer " + token,
                        }
                    }).then((resGet4) => {
                        //Add 400
                        tempTotalList(resGet4);
                        if (resGet4.data.next == null){
                            //NEXT STEP!!
                            if (playlistMix == "" || playlistMix == null) {
                                addNoMix(playlistTo, cardId)
                            }else{
                                addMix(playlistMix, playlistTo, cardId)
                            }
                            return
                        }
                        axios.get(resGet4.data.next, {
                            headers: {
                                Authorization: "Bearer " + token,
                            }
                        }).then((resGet5) => {
                            //Add 500
                            tempTotalList(resGet5);
                            //NEXT STEP!!
                            if (playlistMix == "" || playlistMix == null) {
                                addNoMix(playlistTo, cardId)
                            }else{
                                addMix(playlistMix, playlistTo, cardId)
                            }
                            return
                        })
                    })
                })
            })
        })

    }

    function addMix(playlistMix, playlistTo, cardId){

        const token = props.token;
        let completeMixedList = []

        axios.get(`https://api.spotify.com/v1/playlists/${playlistMix}/tracks`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        }).then((resMix) => {
            //Gets the mixed list
            let mixedOnly = getMixedList(resMix)

            //Mix all tracks togheter
            let mixed = mixInTracks(tempList, mixedOnly, 3)
            //Add all to list both mixedOnly and current tempList
            tempList = [...mixed]
            console.log("Mixed LIST");

            completeMixedList = get100List()
            console.log("Posting 100");
            const newData = {uris: completeMixedList}
            axios.post(`https://api.spotify.com/v1/playlists/${playlistTo}/tracks`, newData, {
                headers: {
                    Authorization: "Bearer " + token,
                }
            }).then((resPost) => {
                if (tempList.length <= 0) return
                completeMixedList = []
                completeMixedList = get100List()
                console.log("Posting 200");
                const newData = {uris: completeMixedList}
                axios.post(`https://api.spotify.com/v1/playlists/${playlistTo}/tracks`, newData, {
                    headers: {
                        Authorization: "Bearer " + token,
                    }
                }).then((resPost2) => {
                    if (tempList.length <= 0) return
                    completeMixedList = []
                    completeMixedList = get100List()
                    console.log("Posting 300");

                    const newData = {uris: completeMixedList}
                    axios.post(`https://api.spotify.com/v1/playlists/${playlistTo}/tracks`, newData, {
                        headers: {
                            Authorization: "Bearer " + token,
                        }
                    }).then((resPost3) => {
                        if (tempList.length <= 0) return
                        completeMixedList = []
                        completeMixedList = get100List()
                        console.log("Posting 400");

                        const newData = {uris: completeMixedList}
                        axios.post(`https://api.spotify.com/v1/playlists/${playlistTo}/tracks`, newData, {
                            headers: {
                                Authorization: "Bearer " + token,
                            }
                        }).then((resPost4) => {
                            if (tempList.length <= 0) return
                            completeMixedList = []
                            completeMixedList = get100List()
                            console.log("Posting 500");

                            const newData = {uris: completeMixedList}
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
        copyMessageComplete(cardId)
    }

    function addNoMix(playlistTo, cardId){
        const token = props.token;
        let completeList = []
        console.log("NO Mix");

        completeList = get100List()
        console.log("Posting 100");
        const newData = {uris: completeList}
        axios.post(`https://api.spotify.com/v1/playlists/${playlistTo}/tracks`, newData, {
            headers: {
                Authorization: "Bearer " + token,
            }
        }).then((resPost) => {
            if (tempList.length <= 0) return
            completeList = []
            completeList = get100List()
            console.log("Posting 200");
            const newData = {uris: completeList}
            axios.post(`https://api.spotify.com/v1/playlists/${playlistTo}/tracks`, newData, {
                headers: {
                    Authorization: "Bearer " + token,
                }
            }).then((resPost2) => {
                if (tempList.length <= 0) return
                completeList = []
                completeList = get100List()
                console.log("Posting 300");

                const newData = {uris: completeList}
                axios.post(`https://api.spotify.com/v1/playlists/${playlistTo}/tracks`, newData, {
                    headers: {
                        Authorization: "Bearer " + token,
                    }
                }).then((resPost3) => {
                    if (tempList.length <= 0) return
                    completeList = []
                    completeList = get100List()
                    console.log("Posting 400");

                    const newData = {uris: completeList}
                    axios.post(`https://api.spotify.com/v1/playlists/${playlistTo}/tracks`, newData, {
                        headers: {
                            Authorization: "Bearer " + token,
                        }
                    }).then((resPost4) => {
                        if (tempList.length <= 0) return
                        completeList = []
                        completeList = get100List()
                        console.log("Posting 500");

                        const newData = {uris: completeList}
                        axios.post(`https://api.spotify.com/v1/playlists/${playlistTo}/tracks`, newData, {
                            headers: {
                                Authorization: "Bearer " + token,
                            }
                        })
                    })
                })
            })
        })
        copyMessageComplete(cardId)
    }

    function copyMessageComplete(cardId){
        setCopycomplete(cardId);
    }

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

    function tempTotalList(respondData){ //Adds URI items and saves to tempList
        console.log(respondData)
        respondData.data.items.map((item, i) => {
            if (!item.track.is_local) {
                return tempList.push(item.track.uri)
            }
        })

        return tempList
    }

    function getMixedList(respondData){ //Only one call returns the mixed list
        let mixedList = []
        mixedList = respondData.data.items.map((item, i) => {
            if (!item.track.is_local) {
                return item.track.uri
            }
        })
        return mixedList
    }

    function get100List(){
        var partOflist = []
        // console.log("Before splice tempList")
        // console.log(tempList.length)
        if (tempList.length >= 100) {
            partOflist = tempList.splice(0, 100)
            return partOflist
        }else{
            partOflist = tempList.slice();
            tempList = [];
            return partOflist
        }
    }

    function mixInTracks(orgArray, mixArray, nrSongsBetween ){
        let mixedTrackArray = [];

        //Add one because to calculate correctely
        nrSongsBetween=nrSongsBetween+1;

        let mixCounter = 0;
        let orgCounter = 0;

        for (let index1 = 1; index1 <= orgArray.length + mixArray.length; index1++) {
            if ((index1%nrSongsBetween==0 && mixCounter<mixArray.length) || orgCounter>=orgArray.length){
                mixedTrackArray.push(mixArray[mixCounter++]);
            } else{
                mixedTrackArray.push(orgArray[orgCounter++]);
            }
        }
        console.log("Mixing Complete")
        return mixedTrackArray;
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
            <div className='listcopy-item'>
                <label>Select Mix With: </label>
                <select className='listcopy-options' onChange={(e) => handleChangeMixWith(e)} value={mixWith.name}>
                <option className='listcopy-options listcopy-options-select' >{"..."}</option>
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
        {/* <PlayListCopyCards copyButton={copyButton} data={props.data} copyComplete={copyComplete}/> */}
        <div className={"listcopy-card-container"}>
            {documents && documents.map((listItem,i) => {
                return <div key={i}>
                <PlayListCopyCard
                    id={i+1}
                    copyButton={copyButton}
                    data={props.data}
                    listItem={listItem}
                    copyComplete={copyComplete}
                />
                </div>
            })}
        </div>
    </div>
  )
}

export default PlaylistCopy