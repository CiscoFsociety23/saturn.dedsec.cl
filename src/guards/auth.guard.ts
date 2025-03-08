import { CanActivate, ExecutionContext, Logger } from "@nestjs/common";
import { Request } from "express";
import { AuthUtil } from "../utils/auth.util";

export class AuthGuard implements CanActivate {
    private logger: Logger = new Logger(AuthGuard.name);
    private authService: AuthUtil = new AuthUtil();
    public async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            this.logger.log(`[ authGuard() ]: Verificando token del usuario`);
            const request: Request = context.switchToHttp().getRequest() as Request;
            const { authorization } = request.headers;
            const verify = await this.authService.validateToken(String(authorization).split(" ")[1]);
            if(verify.data.status){
                this.logger.log(`[ authGuard() ]: Token verificado con éxito ${verify.data.message}`);
                return true;
            } else {
                this.logger.warn(`[ authGuard() ]: No es posible verificar el token ${verify.data.message}`);
                return false;
            };
        } catch (error) {
            this.logger.error(`[ authGuard() ]: Ha ocurrido un error al verificar el token del usuario`);
            return false;
        };
    };
}
