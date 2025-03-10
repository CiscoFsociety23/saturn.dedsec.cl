import { Controller, Get, Logger, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { information } from "../interfaces/saturn.interfaces";
import { SaturnService } from "../services/saturn.service";

@Controller('api-saturn')
export class SaturnController {

    private logger: Logger = new Logger(SaturnController.name);
    constructor(private saturnService: SaturnService) {};

    @Get()
    public async getInformation(@Req() request: Request, @Res() response: Response): Promise<void> {
        try {
            this.logger.log(`[ GET ${request.url} ]: Solicitando informacion del servicio`);
            const serverInformation: information = await this.saturnService.information();
            response.status(200).json(serverInformation);
        } catch (error) {
            this.logger.error(`[ GET ${request.url} ]: Ha ocurrido un error al obtener la informacion del servicio ${error.message}`);
            response.status(400).json({ message: 'No es posible obtener la informacion', error: error.message });
        };
    };

}
