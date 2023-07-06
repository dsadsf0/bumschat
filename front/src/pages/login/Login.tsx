import { UserService } from "@/api/services/UserService";
import InputPrimary from "@/components/UI/inputs/primary-input";
import validateUsername from "@/utils/validateUsername";
import { memo, useState } from "react"
import { Navigate } from "react-router-dom";
import mainRoutes from './../../routes/mainRoutes';
import { useAppSelector } from '@/hooks/useStore';
import { getUser } from '@/store/user/UserSelector';
import { useAppDispatch } from './../../hooks/useStore';
import Loader from "@/components/UI/loader";
import { getUserStateError } from './../../store/user/UserSelector';
import { getUserStateLoading } from '@/store/user/UserSelector';
import { setUserError } from '@/store/user/UserSlice';

const Login = memo((): JSX.Element => {
	const [username, setUsername] = useState<string>('');
	const [authCode, setAuthCode] = useState<string>('');
	const [isVerified, setIsVerified] = useState<boolean>(false);
	const user = useAppSelector(getUser);
	const {login: loginError, loginCheck: loginCheckError} = useAppSelector(getUserStateError);
	const {login: isLoginning, loginCheck: isCheckingLogin} = useAppSelector(getUserStateLoading);
	const dispatch = useAppDispatch();

	const handleSetUsername = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setUsername(e.target.value)
	}

	const handleSetAuthCode = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setAuthCode(e.target.value)
	}

	const handleLoginCheck = async (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.code === 'Enter') {
			if (validateUsername(username)) {
				const res = await dispatch(UserService.loginCheck(username));
				if (typeof res.payload !== 'string') {
					setIsVerified(true);
				} else {
					setUsername('');
					setIsVerified(false);
				}
			} else {
				dispatch(setUserError({key: 'loginCheck', error: 'Invalid Username'}));
				setUsername('');
				setIsVerified(false);
			}
		}
	}

	const handleLogin = async (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.code === 'Enter') {
			const res = await dispatch(UserService.login({username, verificationCode: authCode}));
			if (typeof res.payload === 'string') {
				setAuthCode('');
			} 
		}
	}

	if (user) {
		return (
			<Navigate to={mainRoutes.chats}/>
		)
	}

	if (isVerified) {
		return (
			<div onKeyDown={handleLogin}>
				<InputPrimary
					style="big"
					type="text"
					value={authCode}
					onChange={handleSetAuthCode}
					placeholder={loginError || "Enter 2FA code"}
					isError={loginError !== ''}
				/>
				{isLoginning && <Loader/>}
			</div>
		)
	}

	return (
		<div onKeyDown={handleLoginCheck}>
			<InputPrimary
				style="big"
				type="text"
				value={username}
				onChange={handleSetUsername}
				placeholder={loginCheckError || "Enter your username"}
				isError={loginCheckError !== ''}
				title="You can use only А-я A-z - _ spaces, but you can't use spaces at the beginning and at the end."
			/>
			{isCheckingLogin && <Loader/>}
		</div>
		
	)
})

export default Login