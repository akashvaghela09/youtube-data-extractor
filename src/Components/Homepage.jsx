import React, { useRef, useState } from 'react';
import styles from "./Homepage.module.css"
const HomePage = () => {
    const [tempPlaylist, setTempPlaylist] = useState([])
    const [tempRadiolist, setRadiolist] = useState([])
    const [downloadFile, setDownloadfile] = useState(null)
    const myref= useRef();
    
    const handleLoad = (e) => {
        // console.log("loaded")
        let rawFile = e.target.files[0]
        var fileread = new FileReader();
        fileread.onload = function(e) {
            var content = e.target.result;
            var parsedJSON = JSON.parse(content); // parse json 
            setTempPlaylist([...parsedJSON.playlistData])
            setRadiolist([...parsedJSON.radioData])
          };
        fileread.readAsText(rawFile);
    }
    
    const handleCheck = () => {
        // console.log("checking")
        console.log("playlist : ", tempPlaylist)
        console.log("radiolist : ", tempRadiolist);
    }
    
    const handleDownload = (e) => {
        console.log("downloaded initiated")
        // Prepare the file
        let output = JSON.stringify([], null, 4); 
        
        // Download it
        const blob = new Blob([output]);
        const filedownloadFile = URL.createObjectURL(blob);
        setDownloadfile(filedownloadFile)
        myref.current.click()
    }
    
    return (
        <div className={styles.wrapper}>
            <button className={styles.btn} >Load
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
    )
}

export { HomePage }