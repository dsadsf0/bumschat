import { MainRoutes } from '@/routes/mainRoutes';
import classnames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import cl from './alreadyLogin.module.scss';

const AlreadyLogin: React.FC = () => {
	return (
		<h1>
			You already signed.&nbsp;
			<Link className={classnames(cl['already-login'])} to={MainRoutes.Home} replace={true}>
				Login!
			</Link>
		</h1>
	);
};

export default AlreadyLogin;
