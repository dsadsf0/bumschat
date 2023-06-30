
// socket.emit -- sending message to server
export interface ClientToServerEvents {
	hello: (msg: string) => void;
}

// socket.on -- getting message from server
export interface ServerToClientEvents {
	connected: () => void;
}