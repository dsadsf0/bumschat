import React from 'react';
import { UserService } from '@/api/services/UserService';
import InputPrimary from '@/components/UI/inputs/primary-input';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { useState } from 'react';
import Loader from '@/components/UI/loader/index';
import { getUser, getUserStateLoading } from '@/store/user/UserSelector';
import { setUserError } from '@/store/user/UserSlice';
import { getUserStateError } from '@/store/user/UserSelector';
import ValidationService from '@/utils/validation/validation';
import AlreadyLogin from '@/components/modules/already-login/AlreadyLogin';
import JustSigned from '@/components/modules/just-signed/JustSigned';
import cryptService from '@/utils/crypt/crypt-service';
import cl from './signup.module.scss';

const Signup: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [pass, setPass] = useState<string>('');
    const dispatch = useAppDispatch();
    const [isJustSigned, setIsJustSigned] = useState(false);
    const user = useAppSelector(getUser);
    const { signup: isSigningUp } = useAppSelector(getUserStateLoading);
    const { signup: signupError } = useAppSelector(getUserStateError);

    const handleSetUsername = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setUsername(e.target.value);
    };

    const signup = async (): Promise<void> => {
        if (ValidationService.validateUsername(username)) {
            const publicKey = cryptService.getPublicKey();

            const res = await dispatch(UserService.signup({ username, publicKey }));
            if (res.payload && typeof res.payload !== 'string' && !('statusCode' in res.payload)) {
                const { recoverySecret } = res.payload;
                const recoveryPass = cryptService.decrypt(recoverySecret);
                setPass(recoveryPass);
                setIsJustSigned(true);
            } else {
                setUsername('');
            }
        } else {
            setUsername('');
            dispatch(setUserError({ key: 'signup', error: 'Invalid username' }));
        }
    };

    const signupOnKey = async (e: React.KeyboardEvent<HTMLDivElement>): Promise<void> => {
        if (e.code === 'Enter') {
            await signup();
        }
    };

    if (isJustSigned) {
        return <JustSigned pass={pass} />;
    }

    if (!isJustSigned && user && user?.username) {
        return <AlreadyLogin />;
    }

    return (
        <div onKeyDown={signupOnKey} className={cl.signup}>
            <InputPrimary
                style="big"
                type="text"
                value={username}
                onChange={handleSetUsername}
                placeholder={signupError || 'Enter your username'}
                title={'In username you can use only any Unicode letter character, " ", "-", "_".'}
                isError={signupError !== ''}
            />
            {isSigningUp && <Loader />}
        </div>
    );
};

export default Signup;
