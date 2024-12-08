import { Global, Module } from '@nestjs/common';
import { ErrorCodesService } from './services/error-codes.service';

@Global()
@Module({
  imports: [],
  providers: [ErrorCodesService],
  exports: [ErrorCodesService],
})
export class CommonModule {}
