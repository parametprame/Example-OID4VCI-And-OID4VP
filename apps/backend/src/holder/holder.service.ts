import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Holder } from 'src/agent/holder';
import { PrismaService } from 'prisma/prisma.service';

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
      return new NotFoundException();
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

  async getCredentialOfferByAddress(address: string) {
    const holder = await this.prisma.holder.findUnique({
      where: { id: address },
      include: {
        credentialOffer: true,
      },
    });

    if (!holder) {
      return new NotFoundException();
    }

    const credentialOffers = holder.credentialOffer.map((cre) => {
      const decodedString = cre.metadata.toString('utf-8');
      const decodedJsonObject = JSON.parse(decodedString);
      return decodedJsonObject;
    });

    return credentialOffers;
  }
}
