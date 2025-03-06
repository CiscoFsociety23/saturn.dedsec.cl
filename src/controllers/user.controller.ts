import { Body, Controller, Delete, Get, Logger, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { User, UserTokenDto } from "../interfaces/user.dto";
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
            this.logger.error(`[ GET ${request.url} ]: Ha ocurrido un error al obtener los usuarios ${error.message}`);
            response.status(400).json({ message: 'No es posible obtener los usuarios', error: error.message });
        };
    };

    @Post()
    public async createUser(@Req() request: Request, @Res() response: Response, @Body() user: User): Promise<void> {
        try {
            this.logger.log(`[ POST ${request.url} ]: Solicitando creacion de usuario`);
            const created: UserPublic = await this.userService.createUser(user);
            const validationToken: string = await this.authUtil.getValidationToken({ email: created.email, profile: created.profile });
            const userStatus: string = await this.userStatus.setStatus(created, 3);
            response.status(201).json({ message: "Usuario creado con exito", status: userStatus, user: created, validationData: validationToken });
        } catch (error) {
            this.logger.error(`[ POST ${request.url} ]: Ha ocurrido un error al crear el usuario ${error.message}`);
            response.status(400).json({ message: 'No es posible crear el usuario', error: error.message });
        };
    };

    @Post('validate')
    public async validateUser(@Req() request: Request, @Res() response: Response): Promise<void> {
        try {
            this.logger.log(`[ POST /api-saturn/users/validate ]: Solicitando validar usuario`);
            const { token } = request.query;
            const dataToken: UserTokenDto = await this.userService.getDataToken(String(token));
            const user = await this.userService.getUser(dataToken.email);
            if (user.status != 'PENDING') {
                response.status(401).json({ message: 'El usuario no puede ser validado', user });
            } else {
                const validateToken = await this.authUtil.validateToken(String(token));
                const validationStatus: string = await this.userStatus.updateStatus(user, 4);
                response.status(200).json({ message: 'Usuario validado con éxito', status: validationStatus, validateToken });
            };
        } catch (error) {
            this.logger.error(`[ POST /api-saturn/users/validate ]: Error al validar usuario: ${error.message}`);
            response.status(400).json({ message: 'No es posible validar el usuario', error: error.message });
        };
    };

    @Post('updateStatus')
    public async updateStatus(@Req() request: Request, @Res() response: Response): Promise<void> {
        try {
            const { email, idStatus } = request.query;
            this.logger.log(`[ POST ${request.url} ]: Solicitando actualizar usuario ${String(email)}`);
            const user: UserPublic = await this.userService.getUser(String(email));
            if (typeof user.email === 'string') {
                const status: string = await this.userStatus.updateStatus({ ...user }, Number(idStatus));
                if (typeof status === 'string'){
                    this.logger.log(`[ POST ${request.url} ]: Estado actualizado ${status} | ${String(email)}`);
                    response.status(200).json({ message: 'Estado actualizado con éxito', data: { email: user.email, status }, status: true });
                } else { throw new Error('Estado no encontrado') };
            } else { throw new Error('Usuario no encontrado') };
        } catch (error) {
            this.logger.error(`[ POST ${request.url} ]: Ha ocurrido un error al actualizar el estado`);
            response.status(400).json({ message: 'No es posible actualizar el estado', error: error.message, status: false });
        };
    };

    @Delete()
    public async deleteUser(@Req() request: Request, @Res() response: Response): Promise<void> {
        try {
            this.logger.log(`[ DELETE ${request.url} ]: Solicitando eliminar usuario`);
            const { email } = request.query;
            const user: UserPublic = await this.userService.getUser(String(email));
            const deleteStatus: boolean = await this.userStatus.deleteStatus(user);
            const deleteUser: boolean = await this.userService.deleteUser(user);
            if (deleteStatus && deleteUser) {
                response.status(200).json({ message: 'Usuario elimnado con éxito', deletion: {deleteUser, deleteStatus}, user});
            } else {
                response.status(400).json({ message: 'No es posible eliminar el usuario', deletion: {deleteUser, deleteStatus}});
            };
        } catch (error) {
            this.logger.error(`[ DELETE ${request.url} ]: Ha ocurrido un error al borrar el usuario ${error.message}`);
            response.status(400).json({ message: 'No es posible eliminar el usuario', error: error.message });
        };
    };

}
