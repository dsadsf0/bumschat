export interface ChatInterface {
	name: string,
	type: string,
	users: string[],
}

export type ChatDTOInterface = Omit<ChatInterface, 'users'>