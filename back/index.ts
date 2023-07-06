import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './src/router';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 2001;
const MONGO_URI = process.env.MONGO_CONNECTION || 'mongodb://127.0.0.1:27017/bums-chat';

const app = express();
const server = http.createServer(app);

// socket.emit -- sending message to client
interface ServerToClientEvents {
    ['new message']: (msg: string) => void
}

// socket.on -- getting message from client
interface ClientToServerEvents {
    ['send message']: (msg: string) => void
}

// io.on -- dont have a fucking idea what it do
interface InterServerEvents {
    ping: () => void;
}

//socket.data -- data in socket 
interface SocketData {
    name: string;
}

const io = new Server<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        SocketData
    >(server, {
        cors: {
            origin: '*'
        }
    });

io.on('connection', (socket) => {
    console.log('New connection', socket.id);
    
    socket.on('send message', (msg) => {
        const {user} = socket.handshake.auth;
        socket.data.name = user?.username || null;
        io.sockets.emit('new message', msg);
    });
});

app.use(cookieParser())
app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.use('/qrcodes', express.static('QR-codes'));

const runApp = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGO_URI, {
            maxPoolSize: 10,
            useBigInt64: true,
        });
        console.log(`DB connection has been successful`);
        server.listen(PORT);
        console.log(`Server started on Port ${PORT}`);
    } catch (error: unknown) {
        console.log(error);
    }
};

runApp();