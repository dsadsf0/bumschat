import { ChatType } from './chat.type';

type MessageBody = {
	text: string;
	photo?: string;
	video?: string;
	audio?: string;
};

type MessageFrom = {
	id: string;
	username: string;
};

type MessageChat = {
	id: string;
	name: string;
	type: ChatType;
};

export type MessagePayload = {
	message: MessageBody;
	chat: MessageChat;
};

export type MessageContext = MessagePayload & {
	from: MessageFrom;
};

export type MessageRdo = MessageContext & {
	id: string;
	timestamp: number;
	edited?: number;
};
