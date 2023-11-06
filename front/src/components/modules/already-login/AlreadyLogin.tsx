import { MainRoutes } from '@/routes/mainRoutes';
import classnames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import cl from './alreadyLogin.module.scss';
import { useAppSelector } from '@/hooks/useStore';
import { getUser } from '@/store/user/UserSelector';

const AlreadyLogin: React.FC = () => {
	const user = useAppSelector(getUser);
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
				<div className={classnames(cl['already-login__btn'])}>Log out</div>
			</div>
		</h1>
	);
};

export default AlreadyLogin;
