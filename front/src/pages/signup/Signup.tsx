import { UserService } from "@/api/services/UserService";
import InputPrimary from "@/components/UI/inputs/primary-input"
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { ISignupResponse } from "@/types/api-services/UserService";
import classnames from "classnames";
import { useState } from "react"
import validateUsername from './../../utils/validateUsername';
import cl from './signup.module.scss';
import { API_URL } from './../../api/index';
import { Link, Navigate } from "react-router-dom";
import mainRoutes from "@/routes/mainRoutes";
import Loader from './../../components/UI/loader/index';
import { getUser } from "@/store/user/UserSelector";

const Signup = (): JSX.Element => {
	const [username, setUsername] = useState<string>('');
	const [isError, setIsError] = useState<boolean>(false);
	const [qrImage, setQrImg] = useState<string>('');
	const [pass, setPass] = useState<string>('');
	const dispatch = useAppDispatch();
	const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
	const user = useAppSelector(getUser);

	const loginHandler = () => {
		dispatch(UserService.authCheck());
	}

	const handleSetUsername = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setUsername(e.target.value)
	}

	const handleSignup = async (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.code === 'Enter') {
			if (validateUsername(username)) {
				console.log(username);
				setIsSigningUp(true);
				const res: ISignupResponse | string = await UserService.signup(username);
				setIsSigningUp(false);
				if (typeof res !== 'string') {
					setIsError(false);
					const { qrImg, recoveryPass } = res;
					setQrImg(qrImg);
					setPass(recoveryPass);
				} else {
					setIsError(true);
				}
			} else {
				setIsError(true);
			}
		}
	}

	if (isSigningUp) {
		return (
			<Loader/>
		)
	}

	if (user) {
		return (
			<Navigate to={mainRoutes.home} replace={true}/>
		)
	}

	if (pass === qrImage) {
		return (
			<div onKeyDown={handleSignup}>
				<InputPrimary
					style="big"
					type="text"
					value={username}
					onChange={handleSetUsername}
					placeholder="Enter your username"
					title="You can use only А-я A-z - _ spaces, but you can't use spaces at the beginning and at the end."
					isError={isError}
				/>
			</div>
		)
	}

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
					className={classnames(cl.signup__login)} to={mainRoutes.home} 
					onClick={loginHandler}
				>
					Login!
				</Link>
			</div>
		</div>
	)
}

export default Signup;