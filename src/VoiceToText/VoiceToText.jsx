import React, { Fragment, useState } from 'react'
// Import the cognitive services.
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

const VoiceToText = () => {
      //Set audio configuration to microphone
  var audioConfig;
  audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

  // Set subscription key
  var subscriptionKey = "b844b623f0634a1ba38cf88eaf4e5511";

  // set region of Subscription
  var region = "eastus";

  // Set the sspeech configuration
  var speechConfig;
  speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
    subscriptionKey,
    region
  );

  // Set Recognition language
  const language = "en-US";
  speechConfig.speechRecognitionLanguage = language;

  //State variable to save text. 
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  let lastRecognized = "";

  // On change Handler
  const onChangeHandler = (e) => {
    setText(e.target.value);
  }
  const onSubmitHandler = () => {
    alert(text);
  }

//   Set Speech recognizer config
  let recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

  // On Record Handler
  const onRecordClickHandler = () => {
   
    // Before beginning speech recognition, setup the callbacks to be invoked when an event occurs.

    // The event recognizing signals that an intermediate recognition result is received.
    // You will receive one or more recognizing events as a speech phrase is recognized, with each containing
    // more recognized speech. The event will contain the text for the recognition since the last phrase was recognized.
    recognizer.recognizing = (s, e) => {
      console.log(e);
      console.log(
        "(recognizing) Reason: " +
          SpeechSDK.ResultReason[e.result.reason] +
          " Text: " +
          e.result.text +
          "\r\n"
      );
      setText(lastRecognized + e.result.text);//prevState removed
    };
    // The event recognized signals that a final recognition result is received.
    // This is the final event that a phrase has been recognized.
    // For continuous recognition, you will get one recognized event for each phrase recognized.
    recognizer.recognized = function (s, e) {
      console.log(e);

      // Indicates that recognizable speech was not detected, and that recognition is done.
      if (e.result.reason === SpeechSDK.ResultReason.NoMatch) {
        let noMatchDetail = SpeechSDK.NoMatchDetails.fromResult(e.result);
        console.log(
          "(recognized)  Reason: " +
            SpeechSDK.ResultReason[e.result.reason] +
            " NoMatchReason: " +
            SpeechSDK.NoMatchReason[noMatchDetail.reason] +
            "\r\n"
        );
      } else {
        console.log(
          "(recognized)  Reason: " +
            SpeechSDK.ResultReason[e.result.reason] +
            " Text: " +
            e.result.text +
            "\r\n"
        );
      }
      lastRecognized = lastRecognized + e.result.text + "\r\n";
      setText(lastRecognized);
    };
    // The event signals that the service has stopped processing speech.
    // https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognitioncanceledeventargs?view=azure-node-latest
    // This can happen for two broad classes of reasons.
    // 1. An error is encountered.
    //    In this case the .errorDetails property will contain a textual representation of the error.
    // 2. No additional audio is available.
    //    Caused by the input stream being closed or reaching the end of an audio file.
    recognizer.canceled = function (s, e) {
      console.log(e);

      console.log("(cancel) Reason: " + SpeechSDK.CancellationReason[e.reason]);
      if (e.reason === SpeechSDK.CancellationReason.Error) {
        console.log(": " + e.errorDetails);
      }
      console.log("\r\n");
    };
    // Signals that a new session has started with the speech service
    recognizer.sessionStarted = function (s, e) {
      console.log(e);
      console.log("(sessionStarted) SessionId: " + e.sessionId + "\r\n");
    };
    // Signals the end of a session with the speech service.
    recognizer.sessionStopped = function (s, e) {
      console.log(e);
      console.log("(sessionStopped) SessionId: " + e.sessionId + "\r\n");
      // sdkStartContinousRecognitionBtn.disabled = false;
      // sdkStopContinousRecognitionBtn.disabled = true;
    };
    // Signals that the speech service has started to detect speech.
    recognizer.speechStartDetected = function (s, e) {
      console.log(e);
      console.log("(speechStartDetected) SessionId: " + e.sessionId + "\r\n");
    };

    // Signals that the speech service has detected that speech has stopped.
    recognizer.speechEndDetected = function (s, e) {
      console.log(e);
      console.log(
        "(speechEndDetected) SessionId: " + e.sessionId + "\r\n"
        );
    };

    // Starts recognition
    recognizer.startContinuousRecognitionAsync();

    // sdkStartContinousRecognitionBtn.disabled = true;
    // sdkStopContinousRecognitionBtn.disabled = false;
    setRecording(true);
  };
  const onStopRecordHandler = () => {
        recognizer.stopContinuousRecognitionAsync(
            function () {
                recognizer.close();
                recognizer = undefined;
            },
            function (err) {
                recognizer.close();
                recognizer = undefined;
            });

        setRecording(false);
    
  }
    return (
        <Fragment>
            <div className="voiceToTextWrapper">
                <textarea className="voiceToTextTA" rows="10" cols="100" onChange={(e) => onChangeHandler(e)} value={text} placeholder="Add notes here"></textarea>
                <div className="recordButtonWrapper">
                    {
                    recording 
                    ?  
                    <button className="recordVoiceBTN" onClick={onStopRecordHandler}>Stop</button>
                    :
                    <button className="recordVoiceBTN" onClick={onRecordClickHandler}>Record</button>
                    }
                    
                    <div className={recording ? "listeningVoice" : ""}></div>
                </div>
            </div>
            <div>
                <p>Recorded Message is:</p>
                <p>{text}</p>
            </div>
            <button onClick={onSubmitHandler}>Submit</button>
        </Fragment>
    )
}

export default VoiceToText
