import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useStore';
import { getUser } from '@/store/user/UserSelector';
import { useState } from 'react';
import { MainRoutes } from '@/routes/mainRoutes';
import { UserService } from '@/api/services/UserService';
import { useAppDispatch } from '../../hooks/useStore';
import { getSocket } from '@/utils/socket/init-socket';
import { getCrypt } from '@/utils/crypt/init-crypt';

const Home: React.FC = () => {
	const user = useAppSelector(getUser);
	const [message, setMessage] = useState<string>('');
	const [msgs, setMsgs] = useState<string[]>([]);
	const dispatch = useAppDispatch();
	const socket = getSocket();
	const crypt = getCrypt();

	if (!user) {
		return <Navigate to={MainRoutes.Welcome} />;
	}

	console.log(user);

	return (
		<div>
			HOME
			<div>
				{msgs.map((msg) => (
					<p>{msg}</p>
				))}
			</div>
			<div>
				{/* <input type="text" value={message} onChange={(e): void => setMessage(e.target.value)} placeholder="Enter your message" />
				<button onClick={sendMessage}>Send</button>
				<button onClick={() => dispatch(UserService.logout())}>Logout</button> */}
			</div>
		</div>
	);
};

export default Home;
