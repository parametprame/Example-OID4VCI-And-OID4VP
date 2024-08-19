import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { HolderService } from './holder.service';
import { UserService } from './user.service';
@Controller('holder')
export class HolderController {
  constructor(
    private readonly holderService: HolderService,
    private readonly userService: UserService,
  ) {}

  @Post('resolve-credential-offer')
  async resolveCredentialOffer(@Body() body, @Res() res) {
    const { payload, address } = body;
    try {
      const metadata = await this.holderService.resolveCredentialOffer(
        payload,
        address,
      );
      return res.status(HttpStatus.OK).json(metadata);
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'NotFoundException' });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'INTERNAL_SERVER_ERROR' });
    }
  }

  @Post('accept-credential-offer')
  async acceptCredentialOffer(@Body() body, @Res() res) {
    const { credentialOfferId, address } = body;
    try {
      const prettyClaims = await this.holderService.acceptCredentialOffer(
        address,
        credentialOfferId,
      );
      return res.status(HttpStatus.OK).json(prettyClaims);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'NotFoundException' });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'INTERNAL_SERVER_ERROR' });
    }
  }

  @Post('signIn')
  async signIn(@Body() body, @Res() res) {
    const { message, signature, domain } = body;
    try {
      const address = await this.userService.signIn(message, signature, domain);
      return res.status(HttpStatus.OK).json({ address });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'NotFoundException' });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'INTERNAL_SERVER_ERROR' });
    }
  }

  @Delete('reject-credential-offer/:id/:address')
  async rejectCredentialOffer(@Param() params, @Res() res) {
    try {
      const { id, address } = params;
      await this.holderService.rejectCredential(address, id);
      return res.status(HttpStatus.OK).json();
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'NotFoundException' });
      }
    }
  }

  @Delete('delete-credential/:id/:address')
  async deleteCredential(@Param() params, @Res() res) {
    try {
      const { id, address } = params;
      await this.holderService.deleteCredential(address, id);
      return res.status(HttpStatus.OK).json();
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'NotFoundException' });
      }
    }
  }

  @Get('credential-offer/:id')
  async getCredentialsOffer(@Param() params, @Res() res) {
    try {
      const { id } = params;

      const holder = await this.holderService.getCredentialOfferByAddress(id);
      return res.status(HttpStatus.OK).json(holder);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'NotFoundException' });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'INTERNAL_SERVER_ERROR' });
    }
  }

  @Get('credentials/:id')
  async getCredentials(@Param() params, @Res() res) {
    try {
      const { id } = params;
      const credentials = await this.holderService.getCredentialsByAddress(id);
      return res.status(HttpStatus.OK).json(credentials);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'NotFoundExceptionss' });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'INTERNAL_SERVER_ERROR' });
    }
  }

  @Get('credential/:id/:address')
  async getCredential(@Param() params, @Res() res) {
    try {
      const { id, address } = params;
      const credential = await this.holderService.getCredentialByAddress(
        id,
        address,
      );
      return res.status(HttpStatus.OK).json(credential);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'NotFoundExceptionss' });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'INTERNAL_SERVER_ERROR' });
    }
  }
}
