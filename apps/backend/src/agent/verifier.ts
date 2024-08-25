import type { OpenId4VcVerifierRecord } from '@credo-ts/openid4vc';
import type { DifPresentationExchangeDefinitionV2 } from '@credo-ts/core';

import { AskarModule } from '@credo-ts/askar';
import { OpenId4VcVerifierModule } from '@credo-ts/openid4vc';
import { ariesAskar } from '@hyperledger/aries-askar-nodejs';
import { BaseAgent } from './baseAgent';
import { customRouterVerifier } from 'src/agent/customRoute';

const univesityPresentationDefinition = {
  id: 'UniversityDegreeCredential',
  purpose:
    'Present your UniversityDegreeCredential to verify your education level.',

  input_descriptors: [
    {
      id: 'UniversityDegreeCredentialDescriptor',
      constraints: {
        fields: [
          {
            path: ['$.vc.type.*', '$.vct', '$.type'],
            filter: {
              type: 'string',
              pattern: 'UniversityDegree',
            },
          },
        ],
      },
    },
  ],
};

export const presentationDefinitions = [univesityPresentationDefinition];

export class Verifier extends BaseAgent<{
  askar: AskarModule;
  openId4VcVerifier: OpenId4VcVerifierModule;
}> {
  public verifierRecord!: OpenId4VcVerifierRecord;

  public constructor(port: number, name: string) {
    super({
      port,
      name,
      privateKey: 'VERIFIER_PRIVATE_KEY', // Verifier private key
      modules: {
        askar: new AskarModule({ ariesAskar }),
        openId4VcVerifier: new OpenId4VcVerifierModule({
          baseUrl: `http://localhost:${port}/verifier/siop`,
          router: customRouterVerifier,
        }),
      },
    });
  }

  public static async build(port: number): Promise<Verifier> {
    const verifier = new Verifier(
      port,
      'OpenId4VcVerifier ' + Math.random().toString(),
    );
    await verifier.initializeAgent();
    verifier.verifierRecord =
      await verifier.agent.modules.openId4VcVerifier.createVerifier();

    return verifier;
  }

  // TODO: add method to show the received presentation submission
  public async createProofRequest(
    presentationDefinition: DifPresentationExchangeDefinitionV2,
  ) {
    const { authorizationRequest } =
      await this.agent.modules.openId4VcVerifier.createAuthorizationRequest({
        requestSigner: {
          method: 'did',
          didUrl: this.verificationMethod.id,
        },
        verifierId: this.verifierRecord.verifierId,
        presentationExchange: {
          definition: presentationDefinition,
        },
      });

    return authorizationRequest;
  }
}
