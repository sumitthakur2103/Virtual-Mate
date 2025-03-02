import { Server } from "socket.io"

let connections = {};
let messages = {};
let timeOnline = {};

export const connectToSocket = (server) => {
    //conect webSocket with http server 
    const io = new Server(server, {
        //allow cors so that our websockets and http server works smoothly
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: "*",
            credentials: true
        }
    });

    //it is like a eventlistener 
    io.on("connection", (socket) => {
        console.log("Something connected");

        socket.on("join-call", (path) => {

            //if no room is presented then create a path and initialize with blank array
            if (connections[path] === undefined) {
                connections[path] = [];
            }

            //push user in room(path) array and fill their time of joining room in timeOnline object 
            connections[path].push(socket.id)

            timeOnline[socket.id] = new Date();


            //Notifying other user that new user joined
            for (let a = 0; a < connections[path].length; a++) {
                io.to(connections[path][a]).emit("user-joined", socket.id, connections[path]);
            }

            //providing previous messages for newly joined user
            if (messages[path] !== undefined) {
                for (let a = 0; a < messages[path].length; ++a) {

                    //send chat-message event for newly connected user
                    io.to(socket.id).emit(
                        "chat-message",

                        //data is a actual msg content 
                        messages[path][a]['data'],

                        //sender is who send the specific msg
                        messages[path][a]['sender'],

                        //socket-id-sender is a socket.id of the sender
                        messages[path][a]['socket-id-sender'])
                }
            }
        })

        //the signal event ensures that they stay connected and can communicate whenever needed.
        socket.on("signal", (told, message) => {
            io.to(told).emit("signal", socket.id, message);
        })


        socket.on("chat-message", (data, sender) => {
            //finding room of sender
            const [matchingRoom, found] = Object.entries(connections)
                .reduce(([room, isFound], [roomKey, roomValue]) => {

                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }

                    return [room, isFound];
                }, ['', false]);

            //after finding sender room 
            if (found === true) {
                //if matchingRoom is empty then we initiailize that with blank array
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = [];
                }

                //push sender msg in message object matchingRoom array in the format of
                /*
                messages = {
                    matchingRoom = {
                        sender: sender,
                        data: data,
                        socket-id-sender: socket.id
                    }
                }
                */
                messages[matchingRoom].push({ 'sender': sender, "data": data, "socket-id-sender": socket.id })
                console.log("message", matchingRoom, ":", sender, data)

                //sending the msg for all user in the same room
                connections[matchingRoom].forEach((elem) => {
                    io.to(elem).emit("chat-message", data, sender, socket.id);
                })
            }
        })

        //when user want to exit 
        socket.on("disconnect", () => {

            //total time of user till their exit 
            var diffTime = Math.abs(timeOnline[socket.id] - new Date())

            //store the room name where the user is connected
            var key

            //creating a deep copy
            for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {

                // find the user in every room
                for (let a = 0; a < v; ++a) {
                    if (v[a] === socket.id) {


                        key = k;
                        //itterate over all the reamining room member for gave them info of user disconnected (left)
                        for (let a = 0; a < connections[key].length; ++a) {
                            io.to(connections[key][a]).emit('user-left', socket.id)
                        }

                        //find the index of user in room list
                        var index = connections[key].indexOf(socket.id)

                        //Removes the disconnected user's socket ID from the room's list of users
                        connections[key].splice(index, 1)

                        // if no users remain in the room, it checks if the room should be deleted.
                        if (connections[key].length === 0) {
                            delete connections[key]
                        }
                    }
                }
            }
        })
    })
    return io;
}
