import { SaturnModule } from './modules/saturn.module';
import { Module } from '@nestjs/common';
import { UsersModule } from './modules/user.module';

@Module({
  imports: [SaturnModule, UsersModule]
})
export class AppModule {}
