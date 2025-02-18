import { Injectable } from "@nestjs/common";

@Injectable()
export class SaturnService {
    
    public saturnWelcome(): string {
        return 'API Saturn Dedsec Corp'
    };

}
