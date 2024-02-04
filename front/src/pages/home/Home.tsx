import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useStore';
import { getUser } from '@/store/user/UserSelector';
import { useState } from 'react';
import { MainRoutes } from '@/routes/mainRoutes';
import { Message, socket } from '@/utils/socket/init-socket';
import cryptService from '@/utils/crypt/crypt-service';

const Home: React.FC = () => {
    const user = useAppSelector(getUser);
    const [message, setMessage] = useState<string>('');
    const [msgs, setMsgs] = useState<Message[]>([]);

    const sendMessage = (): void => {
        // MOCK chat

        const sentMessage = {
            chat: {
                id: 'mock-id',
                name: 'mock-name',
                type: 'RTChat' as const,
            },
            message: {
                text: cryptService.encrypt(message),
            },
        };

        console.log('message', message);
        console.log('sentMessage', sentMessage);

        socket.emit('chat-message', sentMessage);
        setMessage('');
    };

    useEffect(() => {
        socket.on('chat-message', (ctx) => {
            console.log('got new message', ctx);
            const text = ctx.message.text;
            ctx.message.text = text ? cryptService.decrypt(text) : '';
            setMsgs([...msgs, ctx]);
        });
    }, []);

    if (!user) {
        return <Navigate to={MainRoutes.Welcome} />;
    }

    return (
        <div>
            HOME
            <div>
                {msgs.map((ctx) => (
                    <div key={ctx.id}>
                        <p>{ctx.from.username}</p>
                        <p>{ctx.message.text}</p>
                    </div>
                ))}
            </div>
            <div>
                <input
                    type="text"
                    value={message}
                    onChange={(e): void => setMessage(e.target.value)}
                    placeholder="Enter your message"
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Home;
