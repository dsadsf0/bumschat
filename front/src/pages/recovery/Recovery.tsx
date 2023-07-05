import InputPrimary from "@/components/UI/inputs/primary-input";
import { useState } from "react";
import cl from './recovery.module.scss';

const Recovery = () => {

    const [username, setUsername] = useState('');
    const [recoveryPass, setRecoveryPass] = useState('');

    const handleSetUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value)
    }

    const handleSetRecoveryPass = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRecoveryPass(e.target.value)
    }

    const handleRecovery = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.code === 'Enter') {
			// dispatch(UserService.login({username, verificationCode: authCode}));
		}
    }

    return (
        <div className={cl.recovery} onKeyDown={handleRecovery}>
            <InputPrimary
                style="big"
                type="text"
                value={username}
                onChange={handleSetUsername}
                placeholder="Enter username"
                isError={'loginError' !== ''}
            />
            <InputPrimary
                style="big"
                type="text"
                value={recoveryPass}
                onChange={handleSetRecoveryPass}
                placeholder="Enter recovery password"
                isError={'loginError' !== ''}
            />
        </div>
    )
}

export default Recovery