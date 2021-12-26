import React, { useRef, useState } from 'react';
import styles from "./Homepage.module.css"
import { v4 as uuid } from "uuid";
import axios from 'axios';
import moment from "moment";

const HomePage = () => {
    const [tempPlaylist, setTempPlaylist] = useState([])
    const [tempRadiolist, setTempRadiolist] = useState([])
    const [downloadFile, setDownloadfile] = useState(null)
    const [searchValue, setSearchValue] = useState("sXFQExxceC4")
    const [searchMode, setSearchMode] = useState("radio")
    const myref= useRef();
    const [playListArray, setPlayListArray] = useState([])
    const [currentPlaylistItemArray, setCurrentPlaylistItemArray] = useState([])
    const [currentPlaylistID, setCurrentPlaylistID] = useState("")
    const [currentRadioItem, setCurrentRadioItem] = useState([])
    
    const handleModeChange = (para) => {
        setSearchMode(para)
        setPlayListArray([])
        setCurrentPlaylistID("")
        setCurrentPlaylistItemArray([])
        setSearchValue("")
    }
    
    const handleLoad = (e) => {
        // console.log("loaded")
        let rawFile = e.target.files[0]
        var fileread = new FileReader();
        fileread.onload = function(e) {
            var content = e.target.result;
            var parsedJSON = JSON.parse(content); // parse json 
            setTempPlaylist([...parsedJSON.playlistData])
            setTempRadiolist([...parsedJSON.radioData])
          };
        fileread.readAsText(rawFile);
    }
    
    const handleCheck = () => {
        console.log(tempPlaylist);
        console.log(tempRadiolist);
        // console.log("checking")
        // console.log("playlist : ", tempPlaylist[0].items);
        // console.log("radiolist : ", tempRadiolist[0].items);
        
        // let playListArray = []
        // let channelNameArray = []
        
        // for(let i = 0; i < tempPlaylist.length; i++){
        //     let playListItemArray = tempPlaylist[i].items
        //     // console.log("inside playlist data")
            
        //     for(let j = 0; j < playListItemArray.length; j++){
        //         // console.log("inside playlist item list")
        //         let playItem = playListItemArray[j];
        //         let channelName = playListItemArray[j].snippet.channelTitle;
        //         let channelFlag = false;
        //         // let playObj = {
        //         //     "id": uuid(),
        //         //     "channelId": playItem.channelId,
        //         //     "playlistId": playItem.playlistId,
        //         //     "videoId": playItem.resourceId.videoId,
        //         //     "channelName": channelName
        //         // }
        //         // console.log(channelName)
        //         for(let k = 0; k < channelNameArray.length; k++){
        //             // console.log("inside array list")
        //             if(channelNameArray[k] === channelName){
        //                 channelFlag = true;
        //             }
        //         }
        //         if(channelFlag === false) {
        //             // console.log("for break")
        //             channelNameArray.push(channelName)
        //             break;
        //         }
                
        //         console.log(playItem)
        //     }
            
            
            
        // }
        
    }
    
    const handleDownload = (e) => {
        console.log("downloaded initiated")

        let downloadObj = {
            "playlistData": tempPlaylist,
            "radioData": tempRadiolist
        }        
        
        console.log(downloadObj)
        
        // Prepare the file
        let output = JSON.stringify(downloadObj, null, 4); 
        
        // Download it
        const blob = new Blob([output]);
        const filedownloadFile = URL.createObjectURL(blob);
        setDownloadfile(filedownloadFile)
        myref.current.click()
    }
    
    const handleInputChange = (e) => {
        // console.log(e.target.value)
        setSearchValue(e.target.value)
    }
    
    const handleSearch = () => {
        if(searchMode === "playlist"){
            searchForPlaylist()       
        } else {
            searchForRadio()
        }
        
    }
    const searchForPlaylist = () => {
        // console.log(searchValue)
        
        axios.get("https://www.googleapis.com/youtube/v3/playlists", {
            params: {
                "key" : process.env.REACT_APP_KEY,
                "channelId" : searchValue,
                "part": "snippet"
            }
        })
        .then((res) => {
            let getRes = res.data.items;
            console.log(getRes)
            
            let tempPlayListArrayResponse = []
            
            for(let i = 0; i < getRes.length; i++){
                let cover = ""
                
                if(getRes[i].snippet.thumbnails.maxres !== undefined){
                    cover = getRes[i].snippet.thumbnails.maxres.url
                } else if (getRes[i].snippet.thumbnails.standard !== undefined){
                    cover = getRes[i].snippet.thumbnails.standard.url
                } else if (getRes[i].snippet.thumbnails.high !== undefined){
                    cover = getRes[i].snippet.thumbnails.high.url
                } else if (getRes[i].snippet.thumbnails.medium !== undefined){
                    cover = getRes[i].snippet.thumbnails.medium.url
                } else if (getRes[i].snippet.thumbnails.default !== undefined){
                    cover = getRes[i].snippet.thumbnails.default.url
                }
                
                let playListObj = {
                    "id": uuid(),
                    "playlistId": getRes[i].id,
                    "channelId": searchValue,
                    "playlistName": getRes[i].snippet.title,
                    "channelName": getRes[i].snippet.channelTitle,
                    "playlistCover": cover
                }
                
                tempPlayListArrayResponse.push(playListObj)
            }
            
            console.log(tempPlayListArrayResponse)
            setPlayListArray([...tempPlayListArrayResponse])
        })
    }
    
    const handlePlaylistItemsSearch = (el, nextPageToken = "", oldResponse = []) => {
        // console.log("el: ", el)
        // console.log("nextPageToken: ", nextPageToken);
        
        
        axios.get("https://www.googleapis.com/youtube/v3/playlistItems", {
            params: {
                "key" : process.env.REACT_APP_KEY,
                "playlistId" : el.playlistId,
                "part": "snippet",
                "maxResults": 50,
                "pageToken": nextPageToken
            }
        })
        .then((res) => {
            let getRes = res.data;
            let pageResultTotal = getRes.pageInfo.totalResults;
            let nextToken = res.data.nextPageToken;
            // console.log("nextToken: ", nextToken);
            // console.log("res: ", res.data);
            let tempPlayListItemArrayResponse = [...oldResponse]
            
            for(let i = 0; i < getRes.items.length; i++){
                let cover = ""
                let vID = getRes.items[i].snippet.resourceId.videoId;
                
                // get video cover
                if(getRes.items[i].snippet.thumbnails.maxres !== undefined){
                    cover = getRes.items[i].snippet.thumbnails.maxres.url
                } else if (getRes.items[i].snippet.thumbnails.standard !== undefined){
                    cover = getRes.items[i].snippet.thumbnails.standard.url
                } else if (getRes.items[i].snippet.thumbnails.high !== undefined){
                    cover = getRes.items[i].snippet.thumbnails.high.url
                } else if (getRes.items[i].snippet.thumbnails.medium !== undefined){
                    cover = getRes.items[i].snippet.thumbnails.medium.url
                } else if (getRes.items[i].snippet.thumbnails.default !== undefined){
                    cover = getRes.items[i].snippet.thumbnails.default.url
                }
                
                // create object
                let playListItemObj = {
                    "id": uuid(),
                    "playlistId": el.playlistId,
                    "channelId": el.channelId,
                    "playlistName": el.playlistName,
                    "channelName": el.channelName,
                    "playlistCover": el.playlistCover,
                    "videoId": vID,
                    "videoName": getRes.items[i].snippet.title,
                    "videoCover": cover,
                    "videoUrl": `https://www.youtube.com/watch?v=${getRes.items[i].snippet.resourceId.videoId}`
                }
                
                
                // get video duration in seconds
                // axios.get("https://www.googleapis.com/youtube/v3/videos", {
                //     params : {
                //         "key": process.env.REACT_APP_KEY,
                //         "part": "snippet,contentDetails",
                //         "id": vID
                //     }
                // })
                // .then((res) => {
                //     let durationString = res.data.items[0].contentDetails.duration
                //     let duration = moment.duration(durationString).asSeconds();
                //     playListItemObj["duration"] = duration;
                // })
                // console.log(i, playListItemObj)
                tempPlayListItemArrayResponse.push(playListItemObj)
            }
            
            if(pageResultTotal > 50 && nextToken !== undefined && nextToken !== ""){
                console.log("called again")
              
                handlePlaylistItemsSearch(el, nextToken, tempPlayListItemArrayResponse)
            } else {
                console.log("stopped")
                // console.log(tempPlayListItemArrayResponse)
                setCurrentPlaylistItemArray(tempPlayListItemArrayResponse)
                return
            }
        })
    }
    
    const loadPlaylist = (el) => {
        if(currentPlaylistID === ""){
            setCurrentPlaylistID(el.id)
        } else {
            setCurrentPlaylistID("")
            return
        }
        
        handlePlaylistItemsSearch(el)
    }
    
    const addPlaylist = () => {
        let tempObj = {
            "id": uuid(),
            "channelName": currentPlaylistItemArray[0].channelName,
            "playlistName": currentPlaylistItemArray[0].playlistName,
            "playlistCover": currentPlaylistItemArray[0].playlistCover,
            "items": currentPlaylistItemArray 
        }
        
        setTempPlaylist([...tempPlaylist, tempObj])
        setCurrentPlaylistItemArray([])
        setCurrentPlaylistID("")
        alert("added")
    }
    
    const searchForRadio = () => {
        console.log("radio is searched")
        
        axios.get("https://www.googleapis.com/youtube/v3/videos", {
            params: {
                "key": process.env.REACT_APP_KEY,
                "part": "contentDetails, snippet",
                "id": searchValue
            }
        })
        .then((res) => {
            let vidResponse = res.data.items[0]
            let cover = ""
            let durationString = vidResponse.contentDetails.duration
            let duration = moment.duration(durationString).asSeconds();
             
            // get video cover
            if(vidResponse.snippet.thumbnails.maxres !== undefined){
                cover = vidResponse.snippet.thumbnails.maxres.url
            } else if (vidResponse.snippet.thumbnails.standard !== undefined){
                cover = vidResponse.snippet.thumbnails.standard.url
            } else if (vidResponse.snippet.thumbnails.high !== undefined){
                cover = vidResponse.snippet.thumbnails.high.url
            } else if (vidResponse.snippet.thumbnails.medium !== undefined){
                cover = vidResponse.snippet.thumbnails.medium.url
            } else if (vidResponse.snippet.thumbnails.default !== undefined){
                cover = vidResponse.snippet.thumbnails.default.url
            }
            
            // create object
            let radioItemObj = {
                "id": uuid(),
                "channelId": vidResponse.snippet.channelId,
                "channelName": vidResponse.snippet.channelTitle,
                "videoId": searchValue,
                "videoName": vidResponse.snippet.title,
                "videoCover": cover,
                "videoUrl": `https://www.youtube.com/watch?v=${searchValue}`,
                "duration": duration
            }
            // console.log(radioItemObj)
            
            setCurrentRadioItem([radioItemObj])
        })
    }
    
    const addRadio = () => {
        console.log(currentRadioItem)
        setTempRadiolist([...tempRadiolist, ...currentRadioItem])
        setCurrentRadioItem([])
        setSearchValue("")
    }
    
    return (
        <div className={styles.wrapper}>
            <div className={styles.btnWrapper}>
                <button className={styles.btn} >Load File
                    <input onChange={(e) => handleLoad(e)} type="file" className={styles.loadInput} />
                </button>
                <button className={styles.btn} onClick={() => handleCheck()}>Check Status</button>
                <button className={styles.btn} onClick={(e) => handleDownload(e)}>Download Template</button>
                <a 
                        className={styles.downloadLink}
                        download="template.json"
                        href={downloadFile}
                        ref={myref}
                    >download link</a>
            </div>
            <div className={styles.modeDiv}>
                <p>Select what you want to search</p>
                <button onClick={() => handleModeChange("playlist")} className={searchMode === "playlist" ? styles.btnSelected : null}>Playlist</button>
                <button onClick={() => handleModeChange("radio")} className={searchMode === "radio" ? styles.btnSelected : null}>Radio</button>
            </div>
            <div className={styles.inputDiv}>
                <input className={styles.searchInput} value={searchValue} onChange={(e) => handleInputChange(e)}/>
                <button onClick={() => handleSearch()}>Search</button>
            </div>
            <div className={styles.resultDiv}>
                {
                    searchMode === "playlist" && playListArray.length > 0 && playListArray.map((el) => {
                        return <div key={el.id} className={styles.listDiv}>
                            <div className={styles.listItem}>
                                <div className={styles.coverDiv}>
                                    <img src={el.playlistCover} alt="playitem cover" className={styles.playCover}/>
                                </div>
                                <div className={styles.dataDiv}>
                                    <p className={styles.header}>{el.playlistName}</p>
                                    <p className={styles.subHeader}>{el.channelName}</p>
                                </div>
                                <div className={styles.btnDiv}>
                                    <button onClick={() => loadPlaylist(el)} className={styles.loadButton}>{currentPlaylistID === el.id ? "Close" : "Load"}</button>
                                </div>
                            </div>
                            {
                                currentPlaylistItemArray.length > 0 && currentPlaylistID === el.id &&
                                <button onClick={() => addPlaylist(el)} className={styles.addButton}>Add All Videos</button>                            
                            }
                            {
                                currentPlaylistItemArray.length > 0 && currentPlaylistID === el.id &&
                                currentPlaylistItemArray.map((item) => {
                                    return <div key={item.id} className={styles.playlistItem}>
                                                    <div className={styles.coverDiv}>
                                                        <img src={item.videoCover} alt="playitem cover" className={styles.playCover}/>
                                                    </div>
                                                    <div className={styles.dataDiv}>
                                                        <p className={styles.header}>{item.videoName}</p>
                                                        <p className={styles.subHeader}>{item.playlistName}</p>
                                                    </div>
                                            </div>
                                })                                
                            }
                        </div>
                    })
                    
                }
                {
                    searchMode === "radio" && currentRadioItem.length > 0 && 
                    <div className={styles.radioResult}>
                        <div className={styles.radioCoverDiv}>
                            <img className={styles.radioCover} src={currentRadioItem[0].videoCover} alt="radio cover" />
                        </div>
                        <div className={styles.radioDataDiv}>
                            <p className={styles.radioName}>{currentRadioItem[0].videoName}</p>
                            <p className={styles.radioChannelName}>{currentRadioItem[0].channelName}</p>
                        </div>
                        <button className={styles.radioAddBtn} onClick={() => addRadio()}>Add to List</button>
                    </div>
                }
            </div>
        </div>
    )
}

export { HomePage }