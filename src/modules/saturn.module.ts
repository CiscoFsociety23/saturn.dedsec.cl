import { Module } from '@nestjs/common';
import { SaturnController } from '../controllers/saturn.controller';
import { SaturnService } from '../services/saturn.service';

@Module({
    controllers: [SaturnController],
    providers: [SaturnService]
})
export class SaturnModule {}
