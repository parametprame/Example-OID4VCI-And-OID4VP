import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { presentationDefinitions, Verifier } from 'src/agent/verifier';

@Injectable()
export class VerifierService {
  constructor(private configService: ConfigService) {}

  private verifier: Verifier;

  async onModuleInit() {
    const PORT = this.configService.get<number>('port');
    this.verifier = await Verifier.build(PORT);
    console.info('Verifier Build Success');
  }

  async createProofRequest(id: string) {
    const presentationDefinition = presentationDefinitions.find(
      (p) => p.id === id,
    );

    return this.verifier.createProofRequest(presentationDefinition);
  }
}
