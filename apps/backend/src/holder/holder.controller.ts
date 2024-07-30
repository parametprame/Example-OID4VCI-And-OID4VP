import {
  Body,
  Controller,
  HttpStatus,
  NotFoundException,
  Post,
  Res,
} from '@nestjs/common';
import { HolderService } from './holder.service';

@Controller('holder')
export class HolderController {
  constructor(private readonly holderService: HolderService) {}

  @Post('resolve-credential-offer')
  async getUser(@Body() body, @Res() res) {
    const { payload } = body;
    try {
      const metadata = await this.holderService.resolveCredentialOffer(payload);
      return res.status(HttpStatus.OK).json(metadata);
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
