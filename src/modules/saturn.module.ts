import { Module } from '@nestjs/common';
import { SaturnController } from 'src/controllers/saturn.controller';
import { SaturnService } from 'src/services/saturn.service';

@Module({
    controllers: [SaturnController],
    providers: [SaturnService]
})
export class SaturnModule {}
