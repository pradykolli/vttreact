import React from 'react';
import './App.css';
import VoiceToText from './VoiceToText/VoiceToText'
import VoiceToText2 from "./VoiceToText/VoiceToText2"
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <VoiceToText />
        <p>Using RecognizeOnceFunction</p>
        <VoiceToText2 />
      </header>
    </div>
  );
}

export default App;
