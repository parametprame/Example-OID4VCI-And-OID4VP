import { InitConfig, ModulesMap, VerificationMethod } from '@credo-ts/core';

import {
  Agent,
  HttpOutboundTransport,
  WsOutboundTransport,
  LogLevel,
  KeyType,
  TypedArrayEncoder,
} from '@credo-ts/core';
import { agentDependencies } from '@credo-ts/node';
import { appLogger } from './logger';

export class BaseAgetWeb<AgentModules extends ModulesMap> {
  public port: number;
  public name: string;
  public config: InitConfig;
  public agent: Agent<AgentModules>;
  public did!: string;
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
      logger: appLogger(LogLevel.debug),
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

    await this.agent.dids.import({
      did: 'did:web:skounis.github.io',
      privateKeys: [
        {
          keyType: KeyType.K256,
          privateKey: TypedArrayEncoder.fromHex(
            '8eb63d435de4d634bc5f3df79c361e9233f55c9c2fca097758eefb018c4c61df',
          ),
        },
      ],
    });

    const [did] = await this.agent.dids.getCreatedDids({
      method: 'web',
      did: 'did:web:skounis.github.io',
    });

    this.did = did.did as string;

    const verificationMethod = did.didDocument.verificationMethod[0];

    if (!verificationMethod) throw new Error('No verification method found');
    this.verificationMethod = verificationMethod;
  }
}
