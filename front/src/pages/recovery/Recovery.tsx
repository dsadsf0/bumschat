import React from 'react';
import InputPrimary from '@/components/UI/inputs/primary-input';
import { useState } from 'react';
import cl from './recovery.module.scss';
import ValidationService from '@/utils/validation';
import { getCrypt } from '@/utils/crypt/init-crypt';
import { UserService } from '@/api/services/UserService';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { getUser, getUserStateError } from '@/store/user/UserSelector';
import { setUserError } from '@/store/user/UserSlice';
import AlreadyLogin from '@/components/modules/already-login/AlreadyLogin';
import JustSigned from '@/components/modules/just-signed/JustSigned';

const Recovery: React.FC = () => {
	const [username, setUsername] = useState('');
	const [recoveryPass, setRecoveryPass] = useState('');
	const [isJustSigned, setIsJustSigned] = useState(false);
	const user = useAppSelector(getUser);
	const { recovery: recoveryError } = useAppSelector(getUserStateError);
	const cryptService = getCrypt();
	const dispatch = useAppDispatch();

	const handleSetUsername = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setUsername(e.target.value);
	};

	const handleSetRecoveryPass = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setRecoveryPass(e.target.value);
	};

	const handleRecovery = async (e: React.KeyboardEvent<HTMLDivElement>): Promise<void> => {
		if (e.code === 'Enter') {
			if (ValidationService.validateUsername(username)) {
				const serverPublicKey = await UserService.getPublicKey();

				const encryptedRecoverySecret = cryptService.encrypt(recoveryPass, serverPublicKey);

				const res = await dispatch(UserService.recovery({ username, recoverySecret: encryptedRecoverySecret }));
				if (res.payload && typeof res.payload !== 'string' && !('statusCode' in res.payload)) {
					setIsJustSigned(true);
				} else {
					setUsername('');
				}
			} else {
				setUsername('');
				dispatch(setUserError({ key: 'signup', error: 'Invalid username' }));
			}
		}
	};

	if (isJustSigned) {
		return <JustSigned pass={recoveryPass} />;
	}

	if (!isJustSigned && user && user?.username) {
		return <AlreadyLogin />;
	}

	return (
		<div className={cl.recovery} onKeyDown={handleRecovery}>
			<InputPrimary style="big" type="text" value={username} onChange={handleSetUsername} placeholder="Enter username" isError={recoveryError !== ''} />
			<InputPrimary
				style="big"
				type="text"
				value={recoveryPass}
				onChange={handleSetRecoveryPass}
				placeholder="Enter recovery password"
				isError={recoveryError !== ''}
			/>
		</div>
	);
};

export default Recovery;
