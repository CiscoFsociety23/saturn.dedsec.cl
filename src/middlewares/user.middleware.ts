import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { UserPublic } from "../interfaces/user.interfaces";
import { UserService } from "../services/user.service";

@Injectable()
export class IsCreatedMiddleware implements NestMiddleware {
    private logger: Logger = new Logger(IsCreatedMiddleware.name);
    private userService: UserService = new UserService();
    public async use(req: Request, res: Response, next: () => void) {
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
        };
    };
}
