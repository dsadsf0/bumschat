export const ChatTypes = {
	StandardChat: 'StandardChat',
	RTChat: 'RTChat',
	OOChat: 'OOChat',
} as const;
export type ChatType = (typeof ChatTypes)[keyof typeof ChatTypes];
