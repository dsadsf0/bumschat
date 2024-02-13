import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CryptoService } from '../crypto/crypto.service';
import { WsException } from '@nestjs/websockets';
import { SocketClient } from './types/socket.type';
import { ChatMessageService } from '../chat-message/chat-message.service';
import { MessageContext, MessageRdo } from '../chat-message/types/message.type';
import { ErrorHandler } from 'src/core/decorators/errorHandler.decorator';

@Injectable()
export class SocketService {
    constructor(
        private readonly userService: UserService,
        private readonly chatMessageService: ChatMessageService,
        private readonly crypt: CryptoService
    ) {}

    public async authMiddleware(client: SocketClient): Promise<void> {
        const encryptedToken = client.handshake.auth.token as string;
        const publicKey = client.handshake.auth.publicKey as string;

        if (!publicKey) {
            throw new WsException(`Client with id: ${client.id} had not provide publicKey!`);
        }

        if (!encryptedToken) {
            throw new WsException(`Client with id: ${client.id} does not have token!`);
        }

        let token = '';
        let username = '';

        try {
            [token, username] = this.crypt.decrypt(encryptedToken).split('_');
        } catch (error) {
            throw new WsException(`Client with id: ${client.id} have invalid token!`);
        }

        if (!token || !username) {
            throw new WsException(`Client with id: ${client.id} have invalid token!`);
        }

        const user = (await this.userService.getUsersByToken(token)).find((user) => user.username === username);

        if (!user) {
            throw new WsException(`Client with id: ${client.id} have invalid token!`);
        }

        client.data.user = user;
        client.data.publicKey = publicKey;
        client.data.user.chats = ['mock-id'];
    }

    @ErrorHandler(SocketService.name)
    private decryptMessageContext(ctx: MessageContext): MessageContext {
        return {
            ...ctx,
            message: {
                ...ctx.message,
                text: this.crypt.decrypt(ctx.message.text),
            },
        };
    }

    @ErrorHandler(SocketService.name)
    public async treatMessage(ctx: MessageContext): Promise<MessageRdo> {
        const decryptedMsgContext = this.decryptMessageContext(ctx);
        const treatedMessage = await this.chatMessageService.treatMessage(decryptedMsgContext);

        return treatedMessage;
    }

    @ErrorHandler(SocketService.name)
    public encryptMessageRdo(msg: MessageRdo, userPublicKey: string): MessageRdo {
        return {
            ...msg,
            message: {
                ...msg.message,
                text: this.crypt.encrypt(msg.message.text, userPublicKey),
            },
        };
    }
}
