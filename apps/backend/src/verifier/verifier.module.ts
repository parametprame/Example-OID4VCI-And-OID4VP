import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { VerifierController } from './verifier.controller';
import { VerifierService } from './verifier.service';
import { ConfigModule } from '@nestjs/config';
import { customRouterVerifier } from 'src/agent/customRoute';

@Module({
  controllers: [VerifierController],
  providers: [VerifierService],
  imports: [ConfigModule],
})
export class VerifierModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(customRouterVerifier).forRoutes('verifier/siop');
  }
}
