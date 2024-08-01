import { Module } from '@nestjs/common';
import { HolderController } from './holder.controller';
import { HolderService } from './holder.service';
import { UserService } from './user.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [HolderController],
  providers: [HolderService, UserService, PrismaService],
})
export class HolderModule {}
