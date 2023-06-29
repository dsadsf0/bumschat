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

// socket.emit
interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}

// socket.on
interface ClientToServerEvents {
    hello: () => void;
}

// io.on
interface InterServerEvents {
    ping: () => void;
}

//socket.data
interface SocketData {
    name: string;
    age: number;
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
    console.log('New connection', socket);
})


app.use(cookieParser())
app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router)

app.use('/qrcodes', express.static('QR-codes'))

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