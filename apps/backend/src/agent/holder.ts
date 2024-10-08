import type {
  OpenId4VcSiopResolvedAuthorizationRequest,
  OpenId4VciResolvedCredentialOffer,
} from '@credo-ts/openid4vc';

import { AskarModule } from '@credo-ts/askar';
import {
  W3cJwtVerifiableCredential,
  W3cJsonLdVerifiableCredential,
  DifPresentationExchangeService,
  JwaSignatureAlgorithm,
} from '@credo-ts/core';
import { OpenId4VcHolderModule } from '@credo-ts/openid4vc';
import { ariesAskar } from '@hyperledger/aries-askar-nodejs';
import { BaseAgent } from './baseAgent';

function getOpenIdHolderModules() {
  return {
    askar: new AskarModule({ ariesAskar }),
    openId4VcHolder: new OpenId4VcHolderModule(),
  } as const;
}

export class Holder extends BaseAgent<
  ReturnType<typeof getOpenIdHolderModules>
> {
  public constructor(port: number, name: string) {
    super({
      port,
      name,
      privateKey: 'HOLDER_PRIVATE_KEY',
      modules: getOpenIdHolderModules(),
    });
  }

  public static async build(port: number): Promise<Holder> {
    const holder = new Holder(
      port,
      'OpenId4VcHolder ' + Math.random().toString(),
    );
    await holder.initializeAgent();

    return holder;
  }

  public async resolveCredentialOffer(credentialOffer: string) {
    return await this.agent.modules.openId4VcHolder.resolveCredentialOffer(
      credentialOffer,
    );
  }

  public async requestAndStoreCredentials(
    resolvedCredentialOffer: OpenId4VciResolvedCredentialOffer,
    credentialsToRequest: string[],
  ) {
    const tokenResponse = await this.agent.modules.openId4VcHolder.requestToken(
      { resolvedCredentialOffer },
    );

    const credentialResponse =
      await this.agent.modules.openId4VcHolder.requestCredentials({
        resolvedCredentialOffer,
        ...tokenResponse,
        // TODO: add jwk support for holder binding
        credentialsToRequest,
        credentialBindingResolver: async () => ({
          method: 'did',
          didUrl: this.verificationMethod.id,
        }),
        allowedProofOfPossessionSignatureAlgorithms: [
          // NOTE: MATTR launchpad for JFF MUST use EdDSA. So it is important that the default (first allowed one)
          // is EdDSA. The list is ordered by preference, so if no suites are defined by the issuer, the first one
          // will be used
          JwaSignatureAlgorithm.EdDSA,
          JwaSignatureAlgorithm.ES256,
        ],
      });

    const storedCredentials = await Promise.all(
      credentialResponse.map(async (response) => {
        const credential = response.credential;

        if (
          credential instanceof W3cJwtVerifiableCredential ||
          credential instanceof W3cJsonLdVerifiableCredential
        ) {
          return this.agent.w3cCredentials.storeCredential({ credential });
        } else {
          return this.agent.sdJwtVc.store(credential.compact);
        }
      }),
    );

    return storedCredentials;
  }

  public async resolveProofRequest(proofRequest: string) {
    const resolvedProofRequest =
      await this.agent.modules.openId4VcHolder.resolveSiopAuthorizationRequest(
        proofRequest,
      );

    return resolvedProofRequest;
  }

  public async acceptPresentationRequest(
    resolvedPresentationRequest: OpenId4VcSiopResolvedAuthorizationRequest,
  ) {
    const presentationExchangeService = this.agent.dependencyManager.resolve(
      DifPresentationExchangeService,
    );

    if (!resolvedPresentationRequest.presentationExchange) {
      throw new Error(
        'Missing presentation exchange on resolved authorization request',
      );
    }

    const submissionResult =
      await this.agent.modules.openId4VcHolder.acceptSiopAuthorizationRequest({
        authorizationRequest: resolvedPresentationRequest.authorizationRequest,
        presentationExchange: {
          credentials: presentationExchangeService.selectCredentialsForRequest(
            resolvedPresentationRequest.presentationExchange
              .credentialsForRequest,
          ),
        },
      });

    return submissionResult.serverResponse;
  }
}
