import { Injectable, Logger } from "@nestjs/common";
import { information } from "src/interfaces/saturn.interfaces";

@Injectable()
export class SaturnService {
    
    private logger: Logger = new Logger(SaturnService.name);

    public information(): information {
        this.logger.log('[ information() ]: Obteniendo informacion del servicio')
        return {
            server: 'Saturn Dedsec', 
            services: [
                { name: 'User Service', status: 'ON-LINE' }
            ]
        };
    };

}
