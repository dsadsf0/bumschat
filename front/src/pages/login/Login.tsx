import React from 'react';
import { UserService } from '@/api/services/UserService';
import InputPrimary from '@/components/UI/inputs/primary-input';
import { memo, useState } from 'react';
import { useAppSelector } from '@/hooks/useStore';
import { getUser } from '@/store/user/UserSelector';
import { useAppDispatch } from '@/hooks/useStore';
import Loader from '@/components/UI/loader';
import { getUserStateError } from '@/store/user/UserSelector';
import { getUserStateLoading } from '@/store/user/UserSelector';
import { setUserError } from '@/store/user/UserSlice';
import ValidationService from '@/utils/validation';
import { getCrypt } from '@/utils/crypt/init-crypt';
import AlreadyLogin from '@/components/modules/already-login/AlreadyLogin';

const Login: React.FC = memo(() => {
	const [username, setUsername] = useState<string>('');
	const [authCode, setAuthCode] = useState<string>('');
	const [isVerified, setIsVerified] = useState<boolean>(false);
	const user = useAppSelector(getUser);
	const cryptService = getCrypt();
	const { login: loginError, loginCheck: loginCheckError } = useAppSelector(getUserStateError);
	const { login: isLoginning, loginCheck: isCheckingLogin } = useAppSelector(getUserStateLoading);
	const dispatch = useAppDispatch();

	const handleSetUsername = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setUsername(e.target.value);
	};

	const handleSetAuthCode = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setAuthCode(e.target.value);
	};

	const loginCheck = async (): Promise<void> => {
		if (ValidationService.validateUsername(username)) {
			const res = await dispatch(UserService.usernameCheck({ username }));
			if (typeof res.payload === 'boolean') {
				setIsVerified(res.payload);
			} else {
				setUsername('');
				setIsVerified(false);
			}
		} else {
			dispatch(setUserError({ key: 'loginCheck', error: 'Invalid Username' }));
			setUsername('');
			setIsVerified(false);
		}
	};

	const login = async (): Promise<void> => {
		if (ValidationService.validate2FA(authCode)) {
			const publicKey = await UserService.getPublicKey();
			const encryptedCode = cryptService.encrypt(authCode, publicKey);
			const res = await dispatch(UserService.login({ username, verificationCode: encryptedCode }));
			if (typeof res.payload === 'string') {
				setAuthCode('');
			}
		} else {
			dispatch(setUserError({ key: 'login', error: 'Invalid 2FA format' }));
			setAuthCode('');
		}
	};

	const loginCheckOnKey = async (e: React.KeyboardEvent<HTMLDivElement>): Promise<void> => {
		if (e.code === 'Enter') {
			await loginCheck();
		}
	};

	const loginOnKey = async (e: React.KeyboardEvent<HTMLDivElement>): Promise<void> => {
		if (e.code === 'Enter') {
			await login();
		}
	};

	if (user) {
		return <AlreadyLogin />;
	}

	if (isVerified) {
		return (
			<div onKeyDown={loginOnKey}>
				<InputPrimary
					style="big"
					type="text"
					value={authCode}
					onChange={handleSetAuthCode}
					placeholder={loginError || 'Enter 2FA code'}
					isError={loginError !== ''}
					title={loginError || ''}
				/>
				{isLoginning && <Loader />}
			</div>
		);
	}

	return (
		<div onKeyDown={loginCheckOnKey}>
			<InputPrimary
				style="big"
				type="text"
				value={username}
				onChange={handleSetUsername}
				placeholder={loginCheckError || 'Enter your username'}
				isError={loginCheckError !== ''}
				title='In username you can use only any Unicode letter character, " ", "-", "_".'
			/>
			{isCheckingLogin && <Loader />}
		</div>
	);
});

export default Login;
