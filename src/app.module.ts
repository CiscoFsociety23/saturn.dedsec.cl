import { SaturnModule } from './modules/saturn.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [SaturnModule]
})
export class AppModule {}
