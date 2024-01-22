import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SnatchedLogger } from 'src/core/services/snatched-logger/logger.service';
import { ChatRoleService } from './chat-role.service';
import { ChatRoleRepository } from './chat-role.repository';
import { ChatRole, ChatRoleSchema } from './chat-role.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
	imports: [MongooseModule.forFeature([{ name: ChatRole.name, schema: ChatRoleSchema }])],
	providers: [ChatRoleService, ChatRoleRepository, ConfigService, SnatchedLogger],
	exports: [ChatRoleService],
})
export class ChatRoleModule {}
