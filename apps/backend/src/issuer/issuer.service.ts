import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Issuer } from 'src/agent/issuer';
import * as mockUser from './mocks/mock-data-issuer.json';

@Injectable()
export class IssuerService {
  constructor(private configService: ConfigService) {}

  private issuer: Issuer;

  async onModuleInit() {
    const PORT = this.configService.get<number>('port');
    this.issuer = await Issuer.build(PORT);
    console.info('Issuer Build Success');
  }

  async createCredentialOffer(offeredCredentials: string[], id: string) {
    if (mockUser.id === id) {
      return this.issuer.createCredentialOffer(offeredCredentials, mockUser);
    } else {
      throw new NotFoundException();
    }
  }

  async validateUser(email: string, password: string) {
    if (mockUser.username === email && mockUser.password === password) {
      return mockUser;
    } else {
      throw new UnauthorizedException('Invalid email or password');
    }
  }

  async getUserById(id: string) {
    if (mockUser.id === id) {
      return mockUser;
    } else {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
