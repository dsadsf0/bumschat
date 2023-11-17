import { MainRoutes } from '@/routes/mainRoutes';
import classnames from 'classnames';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cl from './alreadyLogin.module.scss';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { getUser, getUserStateLoading } from '@/store/user/UserSelector';
import { UserService } from '@/api/services/UserService';
import Loader from '@/components/UI/loader';

const AlreadyLogin: React.FC = () => {
	const user = useAppSelector(getUser);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { logout: isLoggingOut } = useAppSelector(getUserStateLoading);

	const handleLogout = async (): Promise<void> => {
		await dispatch(UserService.logout());
		navigate(MainRoutes.Welcome);
	};

	if (isLoggingOut) {
		return <Loader />;
	}

	return (
		<h1>
			<div>
				You already signed up as <i>{user?.username}</i>.
			</div>
			<div className={classnames(cl['already-login__actions'])}>
				<Link className={classnames(cl['already-login__btn'])} to={MainRoutes.Home} replace={true}>
					Go to chatting!
				</Link>
				<span>/</span>
				<div className={classnames(cl['already-login__btn'])} onClick={handleLogout}>
					Log out
				</div>
			</div>
		</h1>
	);
};

export default AlreadyLogin;
