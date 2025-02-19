import { Body, Controller, Get, Logger, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { User } from "src/interfaces/user.dto";
import { UserService } from "src/services/user.service";

@Controller('api-saturn/users')
export class UserController {

    private logger: Logger = new Logger(UserController.name);

    constructor(private userService: UserService) {};

    @Get()
    public getAllUsers(@Req() request: Request, @Res() response: Response): void {
        this.logger.log(`[ GET ${request.url} ]: Solicitando listado de usuarios`);
        const users: User[] = this.userService.getAllUsers();
        response.status(200).json(users);
    };

    @Post()
    public createUser(@Req() request: Request, @Res() response: Response, @Body() user: User): void {
        this.logger.log(`[ POST ${request.url} ]: Solicitando creacion de usuario`);
        const created: User = this.userService.createUser(user);
        response.status(201).json(created);
    };

}
