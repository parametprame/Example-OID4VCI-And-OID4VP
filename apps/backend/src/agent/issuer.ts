import { ariesAskar } from '@hyperledger/aries-askar-nodejs';
import type {
  OpenId4VcCredentialHolderBinding,
  OpenId4VcCredentialHolderDidBinding,
  OpenId4VciCredentialRequestToCredentialMapper,
  OpenId4VciCredentialSupportedWithId,
  OpenId4VcIssuerRecord,
} from '@credo-ts/openid4vc';
import { customRouterIsuer } from 'src/agent/customRoute';
import { AskarModule } from '@credo-ts/askar';
import {
  ClaimFormat,
  parseDid,
  CredoError,
  W3cCredential,
  W3cCredentialSubject,
  W3cIssuer,
  w3cDate,
} from '@credo-ts/core';
import {
  OpenId4VcIssuerModule,
  OpenId4VciCredentialFormatProfile,
} from '@credo-ts/openid4vc';
import { BaseAgetWeb } from './baseAgentWeb';

export const universityDegreeCredential = {
  id: 'UniversityDegreeCredential',
  format: OpenId4VciCredentialFormatProfile.JwtVcJson,
  types: ['VerifiableCredential', 'UniversityDegreeCredential'],
} satisfies OpenId4VciCredentialSupportedWithId;

export const universityDegreeCredentialSdJwt = {
  id: 'UniversityDegreeCredential-sdjwt',
  format: OpenId4VciCredentialFormatProfile.SdJwtVc,
  vct: 'UniversityDegreeCredential',
} satisfies OpenId4VciCredentialSupportedWithId;

export const credentialsSupported = [
  universityDegreeCredentialSdJwt,
  universityDegreeCredential,
] satisfies OpenId4VciCredentialSupportedWithId[];

function getCredentialRequestToCredentialMapper({
  didId,
}: {
  didId: string;
}): OpenId4VciCredentialRequestToCredentialMapper {
  return async ({ holderBinding, credentialConfigurationIds }) => {
    const credentialConfigurationId = credentialConfigurationIds[0];

    if (credentialConfigurationId === universityDegreeCredential.id) {
      assertDidBasedHolderBinding(holderBinding);

      return {
        credentialSupportedId: universityDegreeCredential.id,
        format: ClaimFormat.JwtVc,
        credential: new W3cCredential({
          type: universityDegreeCredential.types,
          issuer: new W3cIssuer({
            id: didId,
          }),
          credentialSubject: new W3cCredentialSubject({
            id: parseDid(holderBinding.didUrl).did,
          }),
          issuanceDate: w3cDate(Date.now()),
        }),
        verificationMethod: didId,
      };
    }

    if (credentialConfigurationId === universityDegreeCredentialSdJwt.id) {
      return {
        credentialSupportedId: universityDegreeCredentialSdJwt.id,
        format: ClaimFormat.SdJwtVc,
        payload: {
          vct: universityDegreeCredentialSdJwt.vct,
          university: 'Standing University',
          degree: 'bachelor',
          fullName: 'Steve Rogers',
        },

        holder: holderBinding,
        issuer: {
          method: 'did',
          didUrl: 'did:web:skounis.github.io#owner',
        },
        disclosureFrame: { _sd: ['degree', 'university', 'fullName'] },
      };
    }

    throw new Error('Invalid request');
  };
}

export class Issuer extends BaseAgetWeb<{
  askar: AskarModule;
  openId4VcIssuer: OpenId4VcIssuerModule;
}> {
  public issuerRecord!: OpenId4VcIssuerRecord;

  public constructor(port: number, name: string) {
    super({
      port,
      name,
      privateKey:
        '8eb63d435de4d634bc5f3df79c361e9233f55c9c2fca097758eefb018c4c61df', // Issuer private key
      modules: {
        askar: new AskarModule({ ariesAskar }),
        openId4VcIssuer: new OpenId4VcIssuerModule({
          baseUrl: `http://localhost:${port}/issuer/oid4vci`,
          router: customRouterIsuer,
          endpoints: {
            credential: {
              credentialRequestToCredentialMapper: (...args) =>
                getCredentialRequestToCredentialMapper({
                  didId: this.did,
                })(...args),
            },
          },
        }),
      },
    });
  }

  public static async build(port: number): Promise<Issuer> {
    const issuer = new Issuer(
      port,
      'OpenId4VcIssuer ' + Math.random().toString(),
    );

    await issuer.initializeAgent();
    issuer.issuerRecord =
      await issuer.agent.modules.openId4VcIssuer.createIssuer({
        display: [
          {
            name: 'Standing University',
            description:
              'Standing University. is a university that provides the best student.',
            text_color: '#000000',
            background_color: '#FFFFFF',
          },
        ],
        credentialsSupported,
      });

    return issuer;
  }

  public async createCredentialOffer(
    offeredCredentials: string[],
    userInformation: any,
  ) {
    const { credentialOffer } =
      await this.agent.modules.openId4VcIssuer.createCredentialOffer({
        issuerId: this.issuerRecord.issuerId,
        offeredCredentials,
        preAuthorizedCodeFlowConfig: { userPinRequired: false },
        issuanceMetadata: {
          ...userInformation,
        },
      });

    return credentialOffer;
  }
}

function assertDidBasedHolderBinding(
  holderBinding: OpenId4VcCredentialHolderBinding,
): asserts holderBinding is OpenId4VcCredentialHolderDidBinding {
  if (holderBinding.method !== 'did') {
    throw new CredoError(
      'Only did based holder bindings supported for this credential type',
    );
  }
}
