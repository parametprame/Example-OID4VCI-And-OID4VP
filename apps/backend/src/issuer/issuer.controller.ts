import { IssuerService } from './issuer.service';
import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Body,
  Post,
  Param,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';

@Controller('issuer')
export class IssuerController {
  constructor(private readonly issuerService: IssuerService) {}

  @Post('login')
  async login(@Body() body, @Res() res) {
    const { email, password } = body;

    try {
      const user = await this.issuerService.validateUser(email, password);
      return res.status(HttpStatus.OK).json({ ...user });
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'UnauthorizedException' });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'INTERNAL_SERVER_ERROR' });
    }
  }

  @Post('request-credential')
  async requestCredential(@Body() body, @Res() res) {
    const { id } = body;
    try {
      const vc = await this.issuerService.createCredentialOffer(
        ['UniversityDegreeCredential-sdjwt'],
        id,
      );
      return res.status(HttpStatus.OK).json({ credentials: vc });
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

  @Get('user/:id')
  async getUser(@Param('id') id: string, @Res() res) {
    try {
      const user = await this.issuerService.getUserById(id);
      return res.status(HttpStatus.OK).json(user);
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
}
