export interface ForwardedInterface {
	from: string,
	to: string,
}

export interface MessageInterface {
	sender: string,
	receiver: string,
	time: number,
	text: string,
	forwarded: ForwardedInterface | null,
}