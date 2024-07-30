import type {
  InitConfig,
  KeyDidCreateOptions,
  ModulesMap,
  VerificationMethod,
} from '@credo-ts/core';

import {
  Agent,
  DidKey,
  HttpOutboundTransport,
  KeyType,
  WsOutboundTransport,
} from '@credo-ts/core';
import { agentDependencies } from '@credo-ts/node';

export class BaseAgent<AgentModules extends ModulesMap> {
  public port: number;
  public name: string;
  public config: InitConfig;
  public agent: Agent<AgentModules>;
  public did!: string;
  public didKey!: DidKey;
  public kid!: string;
  public verificationMethod!: VerificationMethod;

  public constructor({
    port,
    name,
    modules,
    privateKey,
  }: {
    port: number;
    name: string;
    modules: AgentModules;
    privateKey: string;
  }) {
    this.name = name;
    this.port = port;

    const config = {
      label: name,
      walletConfig: { id: name, key: privateKey },
    } satisfies InitConfig;

    this.config = config;

    this.agent = new Agent({
      config,
      dependencies: agentDependencies,
      modules,
    });

    this.agent.registerOutboundTransport(new HttpOutboundTransport());
    this.agent.registerOutboundTransport(new WsOutboundTransport());
  }

  public async initializeAgent() {
    await this.agent.initialize();

    const didCreateResult = await this.agent.dids.create<KeyDidCreateOptions>({
      method: 'key',
      options: { keyType: KeyType.Ed25519 },
    });

    this.did = didCreateResult.didState.did as string;
    this.didKey = DidKey.fromDid(this.did);
    this.kid = `${this.did}#${this.didKey.key.fingerprint}`;

    const verificationMethod =
      didCreateResult.didState.didDocument?.dereferenceKey(this.kid, [
        'authentication',
      ]);
    if (!verificationMethod) throw new Error('No verification method found');
    this.verificationMethod = verificationMethod;
  }
}
