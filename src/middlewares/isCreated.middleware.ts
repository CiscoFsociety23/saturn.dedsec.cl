import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class IsCreatedMiddleware implements NestMiddleware {

    private logger: Logger = new Logger(IsCreatedMiddleware.name);

    use(req: Request, res: Response, next: () => void) {
        this.logger.log(`[ Verificando si el usuario esta creado ]`);
        next();
    };

}
