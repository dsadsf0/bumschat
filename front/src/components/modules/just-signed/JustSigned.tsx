import { SERVER_API_URI } from '@/api';
import { MainRoutes } from '@/routes/mainRoutes';
import classnames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import cl from './justSigned.module.scss';

type Props = {
    pass: string;
};

const JustSigned: React.FC<Props> = ({ pass }) => {
    return (
        <div className={classnames(cl['just-signed__container'])}>
            <div className={classnames(cl['just-signed__column'])}>
                <div className={classnames(cl['just-signed__info'])}>
                    <p>
                        Your recovery password: <span>{pass}</span>. Remember it to recover your account, if you lost
                        2FA codes.
                    </p>
                    <p>
                        Scan this QR Code to get 2FA codes in Google Authenticator. Download on&nbsp;
                        <a
                            className={classnames(cl['just-signed__link'])}
                            href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                            target="_blank"
                        >
                            Android
                        </a>
                        &nbsp;or&nbsp;
                        <a
                            className={classnames(cl['just-signed__link'])}
                            href="https://apps.apple.com/ru/app/google-authenticator/id388497605"
                            target="_blank"
                        >
                            IOS
                        </a>
                        .
                    </p>
                </div>
                <img src={`${SERVER_API_URI}/users/qr`} alt="" />
                <Link className={classnames(cl['just-signed__login'])} to={MainRoutes.Home}>
                    Go to chatting!
                </Link>
            </div>
        </div>
    );
};

export default JustSigned;
