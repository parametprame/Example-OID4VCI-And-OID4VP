import { Injectable } from '@nestjs/common';
import { SiweMessage } from 'siwe';

@Injectable()
export class UserService {
  async signIn(message: string, signature: string, domain: string) {
    const siwe = new SiweMessage(JSON.parse(message || '{}'));

    const result = await siwe.verify({
      signature: signature || '',
      domain,
    });

    if (result.success) {
      return siwe.address;
    }

    return null;
  }
}
