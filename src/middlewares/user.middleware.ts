import { Injectable, Logger, NestMiddleware, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { UserPublic } from "../interfaces/user.interfaces";
import { UserService } from "../services/user.service";
import { UserTokenDto } from "src/interfaces/user.dto";

@Injectable()
export class IsCreatedMiddleware implements NestMiddleware {
    private logger: Logger = new Logger(IsCreatedMiddleware.name);
    private userService: UserService = new UserService();
    public async use(@Req() req: Request, @Res() res: Response, next: () => void): Promise<void> {
        try {
            this.logger.log(`Verificando si el correo ${req.body.email} esta creado`);
            const list: UserPublic[] = await this.userService.getAllUsers();
            let match: boolean = false;
            list.forEach(user => {
                if(user.email === String(req.body.email)){
                    this.logger.warn(`El usuario ${user.name} ${user.lastName}, esta usando el correo. No es posible crearlo`);
                    match = true
                };
            });
            match ? res.status(400).json({ message: `El email ${req.body.email} ya esta siendo utilizado`}) : next()
        } catch (error) {
            this.logger.error(`Ha ocurrido un error al verificar si estaba creado ${error}`);
            res.status(400).json({ message: `Ha ocurrido un error al verificar si esta creado`, error: error.message });
        };
    };
}

@Injectable()
export class VerifyAdminProfile implements NestMiddleware {
    private logger: Logger = new Logger(VerifyAdminProfile.name);
    private userService: UserService = new UserService();
    public async use(@Req() req: Request, @Res() res: Response, next: () => void): Promise<void> {
        try {
            this.logger.log(`[ VerifyAdminProfile() ]: Verificando el perfil admin del usuario`);
            const { authorization } = req.headers;
            const dataToken: UserTokenDto = await this.userService.getDataToken(String(authorization).split(" ")[1]);
            const user: UserPublic = await this.userService.getUser(dataToken.email);
            if (user.profile === 'ADMIN'){
                this.logger.log(`[ VerifyAdminProfile() ]: Perfil admin encontrado con exito`);
                next();
            } else {
                this.logger.warn(`[ VerifyAdminProfile() ]: El usuario no cuenta con perfil requerido`);
                res.status(400).json({ message: `Perfil inválido`, profile: user.profile, status: false });
            };
        } catch (error) {
            this.logger.error(`[ VerifyAdminProfile() ]: Ha ocurrido un error al verificarl el perfil del usuario`);
            res.status(400).json({ message: `Ha ocurrido un error al verificar el perfil`, error: error.message });
        };
    };
}
