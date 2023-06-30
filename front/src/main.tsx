// import ReactDOM from 'react-dom/client';
import * as ReactDOM from 'react-dom/client';
import App from './app';
import '@/app/styles/default.scss';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from './types/Socket';

export const userSocket: Socket<ClientToServerEvents, ServerToClientEvents> = io('http://localhost:2001');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<App />
);