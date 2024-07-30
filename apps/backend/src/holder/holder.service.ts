import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Holder } from 'src/agent/holder';

@Injectable()
export class HolderService {
  constructor(private configService: ConfigService) {}

  private holder: Holder;

  async onModuleInit() {
    const PORT = this.configService.get<number>('port');
    this.holder = await Holder.build(PORT);
    console.info('Holder Build Success');
  }

  async resolveCredentialOffer(credentialOffer: string) {
    return await this.holder.resolveCredentialOffer(credentialOffer);
  }
}
