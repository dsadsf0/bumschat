import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SnatchedService } from 'src/modules/snatched-logger/logger.service';
import { ChatRoleService } from './chat-role.service';
import { ChatRoleRepository } from './chat-role.repository';

@Module({
	providers: [ChatRoleService, ChatRoleRepository, ConfigService, SnatchedService],
	exports: [ChatRoleService],
})
export class ChatRoleModule {}
