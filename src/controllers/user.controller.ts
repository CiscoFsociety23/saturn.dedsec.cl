import { Body, Controller, Get, Logger, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { User } from "../interfaces/user.dto";
import { UserPublic } from "../interfaces/user.interfaces";
import { UserService } from "../services/user.service";
import { AuthUtil } from "../utils/auth.util";
import { UserStatusUtil } from "../utils/userStatus.util";

@Controller('api-saturn/users')
export class UserController {

    private logger: Logger = new Logger(UserController.name);
    private authUtil: AuthUtil = new AuthUtil();
    private userStatus: UserStatusUtil = new UserStatusUtil();
    constructor(private userService: UserService) {};

    @Get()
    public async getAllUsers(@Req() request: Request, @Res() response: Response): Promise<void> {
        try {
            this.logger.log(`[ GET ${request.url} ]: Solicitando listado de usuarios`);
            const users: UserPublic[] = await this.userService.getAllUsers();
            response.status(200).json({ message: "Listado de usuarios", users: users });
        } catch (error) {
            this.logger.error(`[ GET ${request.url} ]: Ha ocurrido un error al obtener los usuarios ${error}`);
            response.status(400).json({ message: 'No es posible obtener los usuarios', error: error });
        };
    };

    @Post()
    public async createUser(@Req() request: Request, @Res() response: Response, @Body() user: User): Promise<void> {
        try {
            this.logger.log(`[ POST ${request.url} ]: Solicitando creacion de usuario`);
            const created: UserPublic = await this.userService.createUser(user);
            const validationToken: string = await this.authUtil.getValidationToken({ email: created.email, profile: created.profile });
            const userStatus: string = await this.userStatus.setPendingStatus(created);
            response.status(201).json({ message: "Usuario creado con exito", status: userStatus, user: created, validationData: validationToken });
        } catch (error) {
            this.logger.error(`[ POST ${request.url} ]: Ha ocurrido un error al crear el usuario ${error}`);
            response.status(400).json({ message: 'No es posible crear el usuario', error: error });
        };
    };

}
