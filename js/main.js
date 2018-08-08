'use strict';

// On this codelab, you will be streaming only video (video: true).
const mediaStreamConstraints = {
  video: true,
};

// Video element where stream will be placed.
const localVideo = document.querySelector('video');

// Local stream that will be reproduced on the video.
let localStream;


 let localPeerConnection;

// Handles success by adding the MediaStream to the video element.
function gotLocalMediaStream(mediaStream) {
  localStream = mediaStream;
  localVideo.srcObject = mediaStream;
}

// Handles error by logging a message to the console with the error message.
function handleLocalMediaStreamError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

// Initializes media stream.
navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
  .then(gotLocalMediaStream).catch(handleLocalMediaStreamError);



// Logs changes to the connection state.
function handleConnectionChange(event) {
  const peerConnection = event.target;
  console.log('ICE state change event: ', event);
  trace(`${getPeerName(peerConnection)} ICE state: ` +
        `${peerConnection.iceConnectionState}.`);
}


const servers = null;  // Allows for RTC server configuration.


localPeerConnection = new RTCPeerConnection(servers);
 localPeerConnection.addEventListener('icecandidate', handleConnection);
 localPeerConnection.addEventListener('iceconnectionstatechange', handleConnectionChange);

 navigator.mediaDevices.getUserMedia(mediaStreamConstraints).
 	then(gotLocalMediaStream).
 	catch(handleLocalMediaStreamError);

 function gotLocalMediaStream(mediaStream) {
 	localVideo.srcObject = mediaStream;
  localStream = mediaStream;
  trace('Received Local Stream.');
  callButton.disabled = false; //Enable Call Button
 }



 localPeerConnection.addStream(localStream);
 trace('Added local stream to localPeerConnection');

   function handleConnection(event) {
    const peerConnection = event.target;
    const iceCandidate = event.candidate;

    if (iceCandidate) {
      const newIceCandidate = new RTCIceCandidate(iceCandidate);
      const otherPeer = getOtherPeer(peerConnection);

      otherPeer.addIceCandidate(newIceCandidate)
      .then(() => {
        handleConnectionSuccess(peerConnection);
      }).catch((error) => {
        handleConnectionFailre(peerConnection, error);
      });

      trace ('$s{getPeerName(peerConnection)} ICE candidate:\n' +
             '${event.candidate.candidate.');
    }
 }

 trace('localPeerConnection createOffer start');
 localPeerConnection.createOffer(offerOptions)
  .then(createdOffer).catch(setSessionsDescriptionError);

// Logs offer creation and sets peeer connection session descriptions.

function createdOffer(descriptions) {
  trace('Offer from localPeerConnection:\n${descriptions.sdp}');

  trace('localPeerConnection setLocalDescription start.');
  localPeerConnection.setLocalDescription(description)
    .then(() => {
      setLocalDescriptionSuccess(localPeerConnection);
    }).catch(setSessionsDescriptionError);

  trace('remotePeerConnection setRemoteDescription start. ');
  remotePeerConnection.setRemoteDescription(description)
  .then(() => {
    setRemoteDescriptionSuccess(remotePeerConnection);
  }).catch(setSessionsDescriptionError);

  trace('remotePeerConnection createAnswer start.');
  remotePeerConnection.createAnswer()
    .then(createAnswer)
    .catch(setSessionsDescriptionError);
}

// Logs answer to offer creation and sets peer connection session description
function createdAnswer(description) {
  trace('Answer from remotePeerConnection:\n${description.sdp}.');

  trace('remotePeerConnection setLocalDescription start.');
  remotePeerConnection.setLocalDescription(description)
    .then(() => {
      setLocalDescriptionSuccess(remotePeerConnection);
    }).catch(setSessionsDescriptionError);

    trace('localPeerConnection setRemoteDescription start.');
    localPeerConnection.setRemoteDescription(description)
      .then(() => {
        setRemoteDescriptionSuccess(localPeerConnection);
      }).catch(setSessionsDescriptionError);
}

// Logs an action (text) and the time when it happened on the console.
function trace(text) {
  text = text.trim();
  const now = (window.performance.now() / 1000).toFixed(3);

  console.log(now, text);
}

function createConnection() {
  dataChannelSend.placeholder = '';
  var servers = null;
  pcConstraint = null;
  dataConstraint = null;
  trace('Using SCTP based data channles');
  // for SCTP, reliable and ordered delivery is true by default.
  // Add localConnection to global scope to make it visible
  // from the browser console.
  window.localConnection = localConnection = 
    new RTCPeerConnection(servers, pcConstraint);
  trace('Created local peer connection object localConnection');

  sendChannel = localConnection.createDataChannel('sendDataChannel', dataConstraint);
  trace('created send data channel');

  localConnection.onicecandidate = iceCallback1;
  sendChannel.onopen = onSendChannelStateChange;
  sendChannel.onclose = onSendChannelStateChange;

  // Add remoteConnection to global scope to make it visible
  // from the browser console.
  window.remoteConnection = remoteConnection =
    new RTCPeerConnection(servers, pcConstraint);
  trace('Created remote peer connection object remoteConnection');

  remoteConnection.onicecandidate = iceCallback2;
  remoteConnection.ondatachannel = receiveChannelcallback;

  localConnection.createOffer().then(
    gotDescription1,
    onCrreateSessionDescriptionError
    );
  startButton.disabled = true;
  closeButton.disabled = false;
}

function sendData() {
  var data = dataChannelSend.value;
  sendChannel.send(data);
  trace('Sent Data: ' + data);
}
