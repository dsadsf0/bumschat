import { Link } from "react-router-dom"
import { useAppSelector } from '@/hooks/useStore';
import { getUser } from '@/store/user/UserSelector';
import { useState } from 'react';
import { userSocket } from "@/main";
import { useEffect } from 'react';
import mainRoutes from '@/routes/mainRoutes';

const Chat = (): JSX.Element => {
	const user = useAppSelector(getUser);
	const [message, setMessage] = useState<string>('');
	const [msgs, setMsgs] = useState<string[]>([]);

	const handleSubmitMessage = async (e: React.KeyboardEvent<HTMLDivElement>) => {
		console.log(e.key);

		if (e.code === 'Enter') {
			userSocket.emit('send message', message);
			setMessage('');
		}
	}

	useEffect(() => {
		userSocket.auth = {user};
		userSocket.on('new message', msg => {
			setMsgs(prev => [...prev, msg]);
		});
	}, [])

	return (
		<div>
			<div>
				{
					msgs.map(msg => 
						<p>{msg}</p>
					)
				}
			</div>
			<div onKeyDown={handleSubmitMessage}>
				<input 
					type="text" 
					value={message} 
					onChange={(e) => setMessage(e.target.value)}
					placeholder='Enter your message'
				/>
			</div>
		</div>
	)
}

export default Chat