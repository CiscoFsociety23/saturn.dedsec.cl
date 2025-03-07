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

    public async getSessionToken(payload: AuthPayload) {
        try {
            this.logger.log(`[ getSessionToken() ]: Solicitando token de sesión a Dedsec Alpha`);
            const dedsecSessionURL: string | undefined = await this.property.getProperty('Dedsec Alpha Session Token URL');
            const user: string | undefined = await this.property.getProperty('Dedsec Alpha User');
            const pass: string | undefined = await this.property.getProperty('Dedsec Alpha Pass');
            const res = await axios.post(`${String(dedsecSessionURL)}?user=${String(user)}&pass=${String(pass)}`, payload);
            this.logger.log(`[ getSessionToken() ]: Token obtenido con éxito`);
            if(res.status == 200) {
                return res.data;
            } else {
                this.logger.error(`[ getSessionToken() ]: Ha ocurrido un error en la respuesta del servicio ${res.data}`);
                return false;
            };
        } catch (error) {
            this.logger.log(`[ getSessionToken() ]: Ha ocurrido un error al obtener el token de validación ${error}`);
            return error;
        };
    };

    public async validateToken(token: string) {
        try {
            this.logger.log(`[ validateToken() ]: Validado firma del token`);
            const urlQuimera = await this.property.getProperty('Validate Token Sign URL');
            const validate = await axios.post(String(urlQuimera), null, {headers: {'Authorization': `Bearer ${token}`}});
            if(validate.status != 200){
                this.logger.warn(`[ validateToken() ]: El servicio de validacion dio un error ${validate.status}`);
                return false;
            } else {
                this.logger.log(`[ validateToken() ]: Respuesta del servicio ${validate}`);
                return validate.data;
            };
        } catch (error) {
            this.logger.error(`[ validateToken() ]: Ha ocurrido un error al valdar el token ${error.message}`);
            return error;
        };
    };

}
