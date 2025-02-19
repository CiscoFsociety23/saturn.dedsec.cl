import { Controller, Get, Logger, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { information } from "src/interfaces/saturn.interfaces";
import { SaturnService } from "src/services/saturn.service";

@Controller('api-saturn')
export class SaturnController {

    private logger: Logger = new Logger(SaturnController.name);

    constructor(private saturnService: SaturnService) {};

    @Get()
    public getInformation(@Req() request: Request, @Res() response: Response): void {
        this.logger.log(`[ GET ${request.url} ]: Solicitando informacion del servicio`);
        const serverInformation: information = this.saturnService.information();
        response.status(200).json(serverInformation);
    };

}
