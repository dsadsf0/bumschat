import { Link, Navigate } from 'react-router-dom'
import mainRoutes from '@/routes/mainRoutes';
import classNames from 'classnames';
import cl from './welcome.module.scss'
import { useAppSelector } from '@/hooks/useStore';
import { getUser } from '@/store/user/UserSelector';

const Welcome = () => {
    const user = useAppSelector(getUser);

    if (user) {
        return (
            <Navigate to={mainRoutes.chats} replace={true}/>
        )
    }

    return (
        <div className={classNames(cl.welcome)}>
            <h1>Welcome to BUMS Chat</h1>
            <Link to={mainRoutes.login}>Login</Link>
            &nbsp;&nbsp;<span>/</span>&nbsp;
			<Link to={mainRoutes.signup}>Signup</Link>
        </div>
    )
}

export default Welcome