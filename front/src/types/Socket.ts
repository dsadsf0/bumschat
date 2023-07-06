
// socket.emit -- sending message to server
export interface ClientToServerEvents  {
	['send message']: (msg: string) => void
}

// socket.on -- getting message from server
export interface ServerToClientEvents {
	['new message']: (msg: string) => void;
}