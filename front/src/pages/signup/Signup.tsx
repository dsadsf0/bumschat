import { UserService } from "@/api/services/UserService";
import InputPrimary from "@/components/UI/inputs/primary-input"
import { useState } from "react"
import validateUsername from './../../utils/validateUsername';

const Signup = (): JSX.Element => {
	const [username, setUsername] = useState<string>('');
	const [isError, setIsError] = useState<boolean>(false);

	const handleSetUsername = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setUsername(e.target.value)
	}

	const handleSignup = async (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.code === 'Enter') {
			if (validateUsername(username)) {
				console.log(username);
				const res = await UserService.signup(username);
				if (typeof res !== 'string') {
					const { user, qrImg, recoveryPass } = res;
					console.log(user, qrImg, recoveryPass);
				}
				setIsError(false);
			} else {
				setIsError(true);
			}
		}
	}

	return (
		<div onKeyDown={handleSignup}>
			<InputPrimary
				style="big"
				type="text"
				value={username}
				onChange={handleSetUsername}
				placeholder="Enter your username"
				title="You can use only A-z - _ spaces, but you can't use spaces at the beginning and at the end."
				isError={isError}
			/>
		</div>
	)
}

export default Signup