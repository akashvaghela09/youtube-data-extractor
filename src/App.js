import React from 'react';
import styles from  './App.module.css';
import { HomePage } from './Components/Homepage';

function App() {
  console.log("app rendered")
  return (
    <div className={styles.App}>
      <HomePage />
    </div>
  );
}

export default App;
