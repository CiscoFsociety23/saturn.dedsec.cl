import { Body, Controller, Get, Logger, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { User } from "src/interfaces/user.dto";
import { UserPublic } from "src/interfaces/user.interfaces";
import { UserService } from "src/services/user.service";

@Controller('api-saturn/users')
export class UserController {

    private logger: Logger = new Logger(UserController.name);

    constructor(private userService: UserService) {};

    @Get()
    public async getAllUsers(@Req() request: Request, @Res() response: Response): Promise<void> {
        this.logger.log(`[ GET ${request.url} ]: Solicitando listado de usuarios`);
        const users: UserPublic[] = await this.userService.getAllUsers();
        response.status(200).json({ Mensaje: "Listado de usuarios", Usuarios: users });
    };

    @Post()
    public async createUser(@Req() request: Request, @Res() response: Response, @Body() user: User): Promise<void> {
        this.logger.log(`[ POST ${request.url} ]: Solicitando creacion de usuario`);
        const created: UserPublic = await this.userService.createUser(user);
        response.status(201).json({ Mensaje: "Usuario creado con exito", Usuario: created });
    };

}
