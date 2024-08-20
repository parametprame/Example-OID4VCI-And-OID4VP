import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IssuerModule } from './issuer/issuer.module';
import { ConfigModule } from '@nestjs/config';
import { HolderModule } from './holder/holder.module';
import { VerifierModule } from './verifier/verifier.module';
import configuration from './config/configuration';

@Module({
  imports: [
    IssuerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    HolderModule,
    VerifierModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
