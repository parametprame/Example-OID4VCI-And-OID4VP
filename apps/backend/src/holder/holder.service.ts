import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Holder } from 'src/agent/holder';
import { PrismaService } from 'prisma/prisma.service';
import { OpenId4VciResolvedCredentialOffer } from '@credo-ts/openid4vc';

@Injectable()
export class HolderService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  private holder: Holder;

  async onModuleInit() {
    const PORT = this.configService.get<number>('port');
    this.holder = await Holder.build(PORT);
    console.info('Holder Build Success');
  }

  async resolveCredentialOffer(credentialOffer: string, address: string) {
    const holder = await this.prisma.holder.findUnique({
      where: { id: address },
    });

    if (!holder) {
      throw new NotFoundException();
    }

    const metadata = await this.holder.resolveCredentialOffer(credentialOffer);

    const metadaString: string = JSON.stringify(metadata);

    const buffer = Buffer.from(metadaString, 'utf-8');

    await this.prisma.credentialOffer.create({
      data: {
        metadata: buffer,
        holderId: holder.id,
      },
    });

    return metadata;
  }

  async rejectCredential(address: string, id: string) {
    try {
      await this.prisma.credentialOffer.delete({
        where: {
          id,
          holderId: address,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException();
      }
      throw error;
    }
  }

  async deleteCredential(address: string, id: string) {
    try {
      await this.prisma.credential.delete({
        where: {
          id,
          holderId: address,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException();
      }
      throw error;
    }
  }

  async getCredentialOfferByAddress(address: string) {
    const holder = await this.prisma.holder.findUniqueOrThrow({
      where: {
        id: address,
      },
      include: {
        credentialOffer: true,
      },
    });

    if (!holder) {
      throw new NotFoundException();
    }

    const credentialOffers = holder.credentialOffer
      .filter((cre) => cre.isClaimed === false)
      .map((cre) => {
        const decodedString = cre.metadata.toString('utf-8');
        const decodedJsonObject = JSON.parse(decodedString);
        return {
          id: cre.id,
          ...decodedJsonObject,
        };
      });

    return credentialOffers;
  }

  async getCredentialsByAddress(address: string) {
    const credentials = await this.prisma.credential.findMany({
      where: {
        holderId: address,
      },
    });

    const credentialObject = credentials.map((cre) => {
      const decodedString = cre.metadata.toString('utf-8');
      const decodedJsonObject = JSON.parse(decodedString);
      return {
        id: cre.id,
        ...decodedJsonObject,
      };
    });

    return credentialObject;
  }

  async getCredentialByAddress(id: string, address: string) {
    const credential = await this.prisma.credential.findUnique({
      where: {
        id,
        holderId: address,
      },
    });

    const decodedString = credential.metadata.toString('utf-8');
    const credentialObject = JSON.parse(decodedString);

    return { id: credential.id, ...credentialObject };
  }

  async acceptCredentialOffer(
    address: string,
    credentialOfferId: string,
  ): Promise<any> {
    try {
      const credentialOffer =
        await this.prisma.credentialOffer.findUniqueOrThrow({
          where: { id: credentialOfferId, holderId: address },
        });

      const decodedString = credentialOffer.metadata.toString('utf-8');
      const decodedJsonObject = JSON.parse(
        decodedString,
      ) as OpenId4VciResolvedCredentialOffer;

      const storedCredentials = await this.holder.requestAndStoreCredentials(
        decodedJsonObject,
        [decodedJsonObject.offeredCredentials[0].id], // TODO: implement to support multiple id of a credential
      );

      const [prettyClaims] = storedCredentials.map((credential: any) => {
        return this.holder.agent.sdJwtVc.fromCompact(credential.compactSdJwtVc)
          .prettyClaims;
      });

      const credentialsString: string = JSON.stringify(storedCredentials);
      const prettyClaimsString: string = JSON.stringify(prettyClaims);

      const bufferCredential = Buffer.from(credentialsString, 'utf-8');
      const bufferPrettyClaim = Buffer.from(prettyClaimsString, 'utf-8');

      await this.prisma.$transaction([
        this.prisma.credential.create({
          data: {
            credential: bufferCredential,
            metadata: bufferPrettyClaim,
            holderId: address,
          },
        }),
        this.prisma.credentialOffer.update({
          where: { id: credentialOffer.id },
          data: {
            isClaimed: true,
          },
        }),
      ]);

      return prettyClaims;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException();
      }
    }
  }
}
