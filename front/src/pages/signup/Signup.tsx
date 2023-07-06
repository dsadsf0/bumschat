import { UserService } from "@/api/services/UserService";
import InputPrimary from "@/components/UI/inputs/primary-input"
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import classnames from "classnames";
import { useState } from "react"
import validateUsername from './../../utils/validateUsername';
import cl from './signup.module.scss';
import { API_URL } from './../../api/index';
import { Link, Navigate } from "react-router-dom";
import mainRoutes from "@/routes/mainRoutes";
import Loader from './../../components/UI/loader/index';
import { getUser, getUserStateLoading } from "@/store/user/UserSelector";
import { setUserError } from "@/store/user/UserSlice";
import { getUserStateError } from './../../store/user/UserSelector';

const Signup = (): JSX.Element => {
	const [username, setUsername] = useState<string>('');
	const [qrImage, setQrImg] = useState<string>('');
	const [pass, setPass] = useState<string>('');
	const dispatch = useAppDispatch();
	const [isJustSigned, setIsJustSigned] = useState(false)
	const user = useAppSelector(getUser);
	const {signup: isSigningUp} = useAppSelector(getUserStateLoading);
	const {signup: signupError} = useAppSelector(getUserStateError);

	const loginHandler = () => {
		dispatch(UserService.authCheck());
	}

	const handleSetUsername = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setUsername(e.target.value)
	}

	const handleSignup = async (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.code === 'Enter') {
			if (validateUsername(username)) {
				const res = await dispatch(UserService.signup(username));
				if (res.payload && typeof res.payload !== 'string') {
					const { qrImg, recoveryPass } = res.payload;
					setQrImg(qrImg);
					setPass(recoveryPass);
					setIsJustSigned(true);
				} else {
					setUsername('');
				}
			} else {
				setUsername('');
				dispatch(setUserError({key: 'signup', error: 'Invalid username'}))
			}
		}
	}

	if (isJustSigned) {	
		return (
			<div className={classnames(cl.signup__container)}>
				<div className={classnames(cl.signup__column)}>
					<div className={classnames(cl.signup__info)}>
						<p>Your recovery password: <span>{pass}</span>. Remember it to recover your account, if you lost 2FA codes.</p>
						<p>Scan this QR Code to get 2FA codes in Google Authenticator. 
							Download on&nbsp;
							<a className={classnames(cl.signup__link)} href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=ru&gl=US&pli=1" target='_blank'>Android</a> 
							&nbsp;or&nbsp; 
							<a className={classnames(cl.signup__link)} href="https://apps.apple.com/ru/app/google-authenticator/id388497605" target='_blank'>IOS</a>
							.
						</p>
					</div>
					<img src={`${API_URL}/qrcodes/${qrImage}`} alt="" />
					<Link 
						className={classnames(cl.signup__login)} to={mainRoutes.chats} 
						onClick={loginHandler}
					>
						Login!
					</Link>
				</div>
			</div>
		)
	}

	if (!isJustSigned && user && user?.username) {
		return (
			<h1>You already signed.&nbsp;
				<Link 
						className={classnames(cl.signup__login)} to={mainRoutes.chats} 
						onClick={loginHandler}
						replace={true}
					>
						Login!
				</Link>
			</h1>
		)
	}

	return (
		<div onKeyDown={handleSignup}>
			<InputPrimary
				style="big"
				type="text"
				value={username}
				onChange={handleSetUsername}
				placeholder={signupError || "Enter your username"}
				title="You can use only А-я A-z - _ spaces, but you can't use spaces at the beginning and at the end."
				isError={signupError !== ''}
			/>
			{isSigningUp && <Loader/>}
		</div>
	)
}

export default Signup;