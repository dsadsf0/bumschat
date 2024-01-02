import React, { useState } from 'react';
import Home from '@/pages/home';
import Login from '@/pages/login';
import Signup from '@/pages/signup';
import Recovery from '@/pages/recovery';
import Welcome from '@/pages/welcome';
import Loader from '@/components/UI/loader';
import { MainRoutes } from '@/routes/mainRoutes';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserService } from '@/api/services/UserService';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { getUser } from '@/store/user/UserSelector';
import { initSocket } from '@/utils/socket/init-socket';
import cryptService from '@/utils/crypt/crypt-service';

const App: React.FC = () => {
	const dispatch = useAppDispatch();
	const user = useAppSelector(getUser);
	const [isAppInit, setIsAppInit] = useState<boolean>(false);

	const initApp = async (): Promise<void> => {
		setIsAppInit(false);
		const [publicKey] = await Promise.all([UserService.getPublicKey(), dispatch(UserService.getUser())]);
		cryptService.setEncryptKey(publicKey);
		setIsAppInit(true);
	};

	const getAndTreatToken = async (username: string): Promise<{ token: string; publicKey: string }> => {
		const clientPublicKey = cryptService.getPublicKey();
		const { token: userToken, publicKey: serverPublicKey } = await UserService.getToken(clientPublicKey);
		const token = cryptService.decrypt(userToken);
		return {
			token: cryptService.encryptByKey(`${token}_${username}`, serverPublicKey),
			publicKey: clientPublicKey,
		};
	};

	const connectToSocket = async (username: string): Promise<void> => {
		const { token, publicKey } = await getAndTreatToken(username);
		await initSocket(token, publicKey);
	};

	useEffect(() => {
		initApp();
	}, []);

	useEffect(() => {
		if (user) {
			connectToSocket(user.username);
		}
	}, [user]);

	if (!isAppInit) {
		return <Loader />;
	}

	return (
		<BrowserRouter>
			<Routes>
				<Route path={MainRoutes.Welcome} element={<Welcome />} />
				<Route path={MainRoutes.Home} element={<Home />} />
				<Route path={MainRoutes.Login} element={<Login />} />
				<Route path={MainRoutes.Signup} element={<Signup />} />
				<Route path={MainRoutes.Recovery} element={<Recovery />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
