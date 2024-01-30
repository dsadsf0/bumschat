import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { MainRoutes } from '@/routes/mainRoutes';
import classNames from 'classnames';
import cl from './welcome.module.scss';
import { useAppSelector } from '@/hooks/useStore';
import { getUser } from '@/store/user/UserSelector';

const Welcome: React.FC = () => {
    const user = useAppSelector(getUser);

    if (user) {
        return <Navigate to={MainRoutes.Home} replace={true} />;
    }

    return (
        <div className={classNames(cl.welcome)}>
            <h1>Welcome to BUMS Chat</h1>
            <Link to={MainRoutes.Login}>Login</Link>
            &nbsp;&nbsp;<span>/</span>&nbsp;
            <Link to={MainRoutes.Signup}>Signup</Link>
        </div>
    );
};

export default Welcome;
