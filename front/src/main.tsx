// import ReactDOM from 'react-dom/client';
import * as ReactDOM from 'react-dom/client';
import App from './app';
import '@/app/styles/default.scss';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


import { io, Socket } from "socket.io-client";

// socket.on
interface ServerToClientEvents {
	noArg: () => void;
	basicEmit: (a: number, b: string,) => void;
	withAck: (d: string, callback: (e: number) => void) => void;
}

// socket.emit
interface ClientToServerEvents {
	hello: () => void;
}

// please note that the types are reversed
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:2001');
socket.emit('hello');

socket.on('noArg', () => {
	console.log('noArgs');
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<App />
);