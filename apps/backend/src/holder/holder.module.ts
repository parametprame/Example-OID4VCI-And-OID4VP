import { Module } from '@nestjs/common';
import { HolderController } from './holder.controller';
import { HolderService } from './holder.service';
import { UserService } from './user.service';

@Module({
  controllers: [HolderController],
  providers: [HolderService, UserService],
})
export class HolderModule {}
