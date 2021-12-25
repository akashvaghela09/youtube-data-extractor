import React from 'react';
import styles from "./Homepage.module.css"
const HomePage = () => {
    
    const handleLoad = () => {
        console.log("loaded")
    }
    
    const handleCheck = () => {
        console.log("checking")
    }
    
    const handleDownload = () => {
        console.log("downloaded initiated")
    }
    
    return (
        <div className={styles.wrapper}>
            <button className={styles.btn} onClick={() => handleLoad()}>Load Raw File</button>
            <button className={styles.btn} onClick={() => handleCheck()}>Check Status</button>
            <button className={styles.btn} onClick={() => handleDownload()}>Download Template</button>
        </div>
    )
}

export { HomePage }