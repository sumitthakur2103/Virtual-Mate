import React, { useRef, useState, useEffect } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, TextField } from '@mui/material';
import { Button } from '@mui/material';
import { Input } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import styles from '../styles/videoComponent.module.css';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import { use } from 'react';
import { useNavigate } from 'react-router-dom';
import server from '../enviroment';

const server_url = server;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}
export default function VideoMeetComponent() {


    var socketRef = useRef();

    let socketIdRef = useRef();

    let localVideoRef = useRef();

    //it stores whether the user camera/video is available or not for streaming 
    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    //stores the current user preference for enabling or disabling video.
    let [video, setVideo] = useState([]);

    let [audio, setAudio] = useState();

    let [screen, setScreen] = useState();

    let [showModal, setModal] = useState(true);

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([]);

    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(3);

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState("");
    const [error, setError] = useState(false);
    const videoRef = useRef([]);

    let [videos, setVideos] = useState([]);

    useEffect(() => {
        getPermissions();
    }, []);


    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true })

            if (videoPermission) {
                setVideoAvailable(true);
            }
            else {
                setVideoAvailable(false);
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true })
            if (audioPermission) {
                setAudioAvailable(true);
            }
            else {
                setAudioAvailable(false);
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true)
            }
            else {
                setScreenAvailable(false)
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable })

                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = userMediaStream;
                    }
                }
            }

        } catch (err) {
            console.log(err);
        }
    };



    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
        }
    }, [video, audio]);


    let getMedia = () => {
        setVideo(videoAvailable)
        setAudio(audioAvailable)
        connectToSocketServer();
    }

    let getUserMediaSuccess = (stream) => {

        try {
            window.localStream.getTracks().forEach(track => track.stop())

        } catch (e) { console.log(e) };

        window.localStream = stream;
        localVideoRef.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue;

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
                    })
                    .catch((e) => console.log(e));
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false)
            setAudio(false);

            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            //TODO BlackSilence

            let blacksilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blacksilence();
            localVideoRef.current.srcObject = window.localStream


            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
                        })
                        .catch((e) => console.log(e));
                })
            }
        })
    }


    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e));
        }
        else {
            try {
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
            catch (e) { }
        }
    }


    let gotMessageFromServer = (fromId, message) => {

        var signal = JSON.parse(message);

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp))
                    .then(() => {
                        if (signal.sdp.type === "offer") {
                            connections[fromId].createAnswer().then((description) => {
                                connections[fromId].setLocalDescription(description).then(() => {
                                    socketRef.current.emit("signal", fromId, JSON.stringify({ "sdp": connections[fromId].localDescription }))
                                }).catch(e => console.log(e))
                            }).catch(e => console.log(e))
                        }
                    }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }




    let connectToSocketServer = () => {

        socketRef.current = io.connect(server_url, { secure: false });

        socketRef.current.on('signal', gotMessageFromServer);

        socketRef.current.on('connect', () => {

            socketRef.current.emit("join-call", window.location.href);

            socketIdRef.current = socketRef.current.id;

            socketRef.current.on('chat-message', addMessage);

            socketRef.current.on('user-left', (id) => {
                setVideo((videos) => videos.filter((video) => video.socketId !== id))
            });

            socketRef.current.on("user-joined", (id, clients) => {

                clients.forEach((socketListId) => {
                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections);

                    connections[socketListId].onicecandidate = (event) => {

                        if (event.candidate !== null) {
                            socketRef.current.emit("signal", socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }

                    }

                    //handling the addition of video/audio streams when a peer sends their media stream to the current user. 
                    connections[socketListId].onaddstream = (event) => {
                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {

                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoPlay: true,
                                playsinline: true
                            }
                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    }


                    //handles sending the current user's media stream (video/audio) to other users in the call and setting up peer-to-peer connections for communication.
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream);
                    } else {
                        //todo blacksilence

                        let blacksilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blacksilence();
                        connections[socketListId].addStream(window.localStream);
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream);
                        } catch (e) {
                            console.log(e)
                        }

                        //saare users offer create karenge and also answer k liye rqst karenge for newly joined user
                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit("signal", id2, JSON.stringify({ "sdp": connections[id2].localDescription }))
                                })
                                .catch((e) => {
                                    console.log(e);
                                });
                        });
                    }
                }
            })
        })
    }


    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator();

        let dst = oscillator.connect(ctx.createMediaStreamDestination());

        oscillator.start();
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }

    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })

        canvas.getContext('2d').fillRect(0, 0, width, height)

        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }


    let addMessage = (data, sender, socketIdSender) => {

        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);

        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevMessages) => prevMessages + 1);
        }
    }

    let routeTo = useNavigate();


    let connect = () => {
        if (username.trim() === '') {
            setError(true);
        } else {
            setError(false);
            setAskForUsername(false)
            getMedia();
        }
    }


    let handleVideo = () => {
        setVideo(!video);
    }

    let handleAudio = () => {
        setAudio(!audio);
    }

    let handleChat = () => {
        setModal(!showModal);
    }
    let getDisplayMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) {
            console.log(e)
        }

        window.localStream = stream;
        localVideoRef.current.srcObject = stream;

        for (let id in connections) {
            if (id === socketIdRef.current) continue;

            connections[id].addStream(window.localStream);

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
                    })
                    .catch((e) => console.log(e));
            })
        }
        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            //TODO BlackSilence

            let blacksilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blacksilence();
            localVideoRef.current.srcObject = window.localStream

            getUserMedia();
        })
    }

    let getDisplayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDisplayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e));
            }
        }
    }
    useEffect(() => {
        if (screen !== undefined) {
            getDisplayMedia();
        }
    }, [screen]);

    let handleScreen = () => {
        setScreen(!screen);
    }

    let sendMessage = () => {
        socketRef.current.emit("chat-message", message, username);
        setMessage("");
    }


    let handleEndCall = () => {
        try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        } catch { e => console.log(e) }

        routeTo("/home");
    }
    return (
        <div>
            {askForUsername === true ?



                // Connecting Page
                <div className={styles.connectingPage}>
                    <div className={styles.navbar}>
                        <div className={styles.logo}>Virtual-Mate</div>
                    </div>
                    <div className={styles.connectingPageContainer}>
                        <div className={styles.connectingPageInput}>
                            <h2>Let’s Connect & Meet! 🎥</h2>
                            <TextField id="outlined-basic"
                                label="Who’s joining? 🤔..."
                                value={username}
                                variant="outlined"
                                onChange={(e) => setUsername(e.target.value)}
                                error={error}
                                helperText={error ? 'Please enter your username to join the meeting' : ''} />
                            <Button variant="contained" onClick={connect} sx={{ marginLeft: 2 }}>Connect</Button>
                        </div>


                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: "center" }}>
                            <video ref={localVideoRef} autoPlay muted className={styles.connectingPageVideo}></video>
                            <div className={styles.connectingPageVideoBtns}>

                                <IconButton onClick={handleVideo} style={{ color: 'white', fontSize: '32px' }}>
                                    {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
                                </IconButton>
                                <IconButton style={{ color: 'white', fontSize: '32px' }} onClick={handleAudio}>
                                    {audio === true ? <MicIcon /> : <MicOffIcon />}
                                </IconButton>

                            </div>
                        </div>
                    </div>

                </div> :




                // Video Meet Page
                <div className={styles.videoMeetAllContentDiv}>

                    <div
                        className={styles.conferenceView}
                        style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(auto-fit, minmax(${window.innerWidth < 768 ? "100%" :
                                window.innerWidth < 480 ? "100%" :
                                    Math.max(100, 800 / Math.ceil(Math.sqrt(videos.length)))}px, 1fr))`,
                            gridTemplateRows: "auto",
                            gap: "10px",
                            overflowY: "auto",
                            scrollbarWidth: "thin",
                            scrollbarColor: "#ccc transparent",
                        }}
                    >
                        {videos.map((video) => (
                            <div key={video.socketId} className={styles.videoContainer}>
                                <video
                                    data-socket={video.socketId}
                                    ref={(ref) => {
                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream;
                                        }
                                    }}
                                    autoPlay
                                    className={styles.videoElement}
                                    style={{
                                        width: `${window.innerWidth < 468 ? "100%" : Math.max(100, 800 / Math.ceil(Math.sqrt(videos.length)))}px`,
                                        height: `${window.innerWidth < 468 ? "100%" : Math.max(75, (800 / Math.ceil(Math.sqrt(videos.length))) * 0.75)}px`,
                                    }}
                                />
                            </div>
                        ))}
                    </div>




                    <div className={styles.localUserInterface}>
                        <div className={styles.localUserVideo}>
                            <video className={styles.meetUserVideo} ref={localVideoRef} autoPlay muted></video>


                            <div className={styles.buttonContainers}>

                                <IconButton onClick={handleVideo} style={{ color: 'white', fontSize: '32px' }}>
                                    {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
                                </IconButton>


                                <IconButton style={{ color: 'white', fontSize: '32px' }} onClick={handleAudio}>
                                    {audio === true ? <MicIcon /> : <MicOffIcon />}
                                </IconButton>


                                <IconButton onClick={handleEndCall} style={{ backgroundColor: "red", color: 'white', fontSize: '32px' }} >
                                    <CallEndIcon />
                                </IconButton>

                                {screenAvailable === true ?
                                    <IconButton onClick={handleScreen} style={{ color: 'white' }}>
                                        {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                                    </IconButton> : <></>
                                }

                                <Badge badgeContent={newMessages} max={999} color="secondary">
                                    <IconButton onClick={handleChat} style={{ color: 'white', fontSize: '32px' }} >
                                        <ChatIcon />
                                    </IconButton>
                                </Badge>
                            </div>

                        </div>
                        <div className='chatOuterMostDiv'>
                            {showModal ?
                                <div className={styles.localUserChat}>

                                    <div className={styles.chatRoom}>

                                        <div className={styles.chatContainer}>


                                            <h1 style={{ color: "white", textAlign: "center" }}>Chat</h1>
                                            <div className={styles.chattingDisplay}>

                                                {messages.length > 0 ? messages.map((item, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <p style={{ fontWeight: "bold" }}>{item.sender} :</p>
                                                            <p>{item.data}</p>
                                                        </div>
                                                    )
                                                }) : <p>No Messages</p>}
                                            </div>

                                        </div>

                                        <div className={styles.chattingArea}>

                                            <TextField value={message} onChange={e => setMessage(e.target.value)} id="outlined-basic" label="Enter Your Message" variant="outlined" />
                                            <Button variant="contained" onClick={sendMessage}>Send</Button>
                                        </div>
                                    </div> : <div style={{ display: "none" }}></div>
                                </div>
                                : <></>}
                        </div>

                    </div>
                    <div className={styles.buttonContainersForMobile}>

                        <IconButton onClick={handleVideo} style={{ color: 'white', fontSize: '32px' }}>
                            {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>


                        <IconButton style={{ color: 'white', fontSize: '32px' }} onClick={handleAudio}>
                            {audio === true ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>


                        <IconButton onClick={handleEndCall} style={{ backgroundColor: "red", color: 'white', fontSize: '32px' }} >
                            <CallEndIcon />
                        </IconButton>

                        {screenAvailable === true ?
                            <IconButton onClick={handleScreen} style={{ color: 'white' }}>
                                {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                            </IconButton> : <></>
                        }

                        <Badge badgeContent={newMessages} max={999} color="secondary">
                            <IconButton onClick={handleChat} style={{ color: 'white', fontSize: '32px' }} >
                                <ChatIcon />
                            </IconButton>
                        </Badge>
                    </div>
                </div>
            }
        </div>
    )
}
