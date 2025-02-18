import { Module } from '@nestjs/common';
import { SaturnController } from '../controllers/saturn.controller';

@Module({
    controllers: [SaturnController]
})
export class SaturnModule {}
