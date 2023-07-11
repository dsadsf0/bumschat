import { Navigate } from "react-router-dom"
import { useAppSelector } from '@/hooks/useStore';
import { getUser } from '@/store/user/UserSelector';
import { useState } from 'react';
import { userSocket } from "@/main";
import { useEffect } from 'react';
import mainRoutes from '@/routes/mainRoutes';
import { UserService } from '@/api/services/UserService';
import { useAppDispatch } from './../../hooks/useStore';

const Chat = (): JSX.Element => {
	const user = useAppSelector(getUser);
	const [message, setMessage] = useState<string>('');
	const [msgs, setMsgs] = useState<string[]>([]);
	const dispatch = useAppDispatch();

	const handleSubmitMessage = async (e: React.KeyboardEvent<HTMLDivElement>) => {
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

	if(!user) {
		return (
			<Navigate to={mainRoutes.welcome}/>
		)
	}

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
				<button onClick={() => dispatch(UserService.logout())}>Logout</button>
			</div>
		</div>
	)
}

export default Chat