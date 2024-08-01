import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SiweMessage } from 'siwe';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async signIn(message: string, signature: string, domain: string) {
    const siwe = new SiweMessage(JSON.parse(message || '{}'));

    const result = await siwe.verify({
      signature: signature || '',
      domain,
    });

    if (result.success) {
      const holder = await this.prisma.holder.findUnique({
        where: { id: siwe.address },
      });

      if (holder) {
        return holder.address;
      }

      const newHolder = await this.prisma.holder.create({
        data: {
          id: siwe.address,
          address: siwe.address,
        },
      });

      return newHolder.address;
    }

    return null;
  }
}
