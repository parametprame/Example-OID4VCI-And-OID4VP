import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { VerifierService } from './verifier.service';

@Controller('verifier')
export class VerifierController {
  constructor(private readonly verifierService: VerifierService) {}

  @Post('request-proof')
  async requestProof(@Body() body, @Res() res) {
    try {
      const proofRequest = await this.verifierService.createProofRequest(
        'UniversityDegreeCredential',
      );
      return res.status(HttpStatus.OK).json({ proofRequest });
    } catch (error) {}
  }
}
