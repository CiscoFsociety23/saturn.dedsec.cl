import { Logger } from "@nestjs/common";
import axios from 'axios';
import { PropertyUtil } from "./property.util";
import { AuthPayload } from "../interfaces/user.interfaces";

export class AuthUtil {

    private logger: Logger = new Logger(AuthUtil.name);
    private property: PropertyUtil = new PropertyUtil();

    public async getValidationToken(payload: AuthPayload) {
        try {
            this.logger.log(`[ getValidationToken() ]: Solicitando token de validacion a Dedsec Alpha`);
            const dedsecValidationURL: string | undefined = await this.property.getProperty('Dedsec Alpha Validation Token URL');
            const user: string | undefined = await this.property.getProperty('Dedsec Alpha User');
            const pass: string | undefined = await this.property.getProperty('Dedsec Alpha Pass');
            const res = await axios.post(`${String(dedsecValidationURL)}?user=${String(user)}&pass=${String(pass)}`, payload);
            this.logger.log(`[ getValidationToken() ]: Token obtenido con éxito`);
            if(res.status == 200) {
                return res.data;
            } else {
                this.logger.error(`[ getValidationToken() ]: Ha ocurrido un error en la respuesta del servicio ${res.data}`);
                return false;
            };
        } catch (error) {
            this.logger.log(`[ getValidationToken() ]: Ha ocurrido un error al obtener el token de validación ${error}`);
            return error;
        };
    };

}
