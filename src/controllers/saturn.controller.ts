import { Controller, Get } from "@nestjs/common";
import { SaturnService } from "../services/saturn.service";

@Controller('api-saturn')
export class SaturnController {

    private saturnService: SaturnService = new SaturnService();

    @Get()
    public index(): string {
        return this.saturnService.saturnWelcome();
    };

}
