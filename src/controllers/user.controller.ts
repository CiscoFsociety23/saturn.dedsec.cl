import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Put, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { UserDto, UserTokenDto, UserUpdateDto } from "../interfaces/user.dto";
import { UserPublic, LogIn } from "../interfaces/user.interfaces";
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
            const { email } = request.query;
            if(email){
                this.logger.log(`[ GET ${request.url} ]: Solicitando usuario ${email}`);
                const user = await this.userService.getUser(String(email));
                if (user.email === String(email)){
                    response.status(200).json({ message: "Usuario encontrado con éxito", user });
                } else { throw new Error(`Usuario ${email} no registrado`) };
            } else {
                this.logger.log(`[ GET ${request.url} ]: Solicitando listado de usuarios`);
                const users: UserPublic[] = await this.userService.getAllUsers();
                if (users.length > 0){
                    response.status(200).json({ message: "Listado de usuarios", users: users });
                } else { throw new Error(`No hay usuarios registrados`) };
            };
        } catch (error) {
            this.logger.error(`[ GET ${request.url} ]: Ha ocurrido un error al obtener los usuarios ${error.message}`);
            response.status(400).json({ message: 'No es posible obtener la información', error: error.message });
        };
    };

    @Post()
    public async createUser(@Req() request: Request, @Res() response: Response, @Body() user: UserDto): Promise<void> {
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

    @Post('logIn')
    public async logIn(@Req() request: Request, @Res() response: Response, @Body() logIn: LogIn): Promise<void> {
        try {
            this.logger.log(`[ POST ${request.url} ]: Solicitando verificacion de usuario ${logIn.email}`);
            const verify = await this.userService.verificateUser(logIn);
            if(verify == true) {
                const user: UserPublic = await this.userService.getUser(logIn.email);
                if(user.status === 'VALIDATED'){
                    const sessionToken = await this.authUtil.getSessionToken({ email: user.email, profile: user.profile });
                    response.status(200).json({ message: 'Acceso correcto', status: verify, token: sessionToken.token, user });
                } else { throw new Error(`Estado del usuario no es validado: ${user.status}`) };
            } else { throw new Error(`${verify}`) };
        } catch (error) {
            this.logger.error(`[ POST ${request.url} ]: Ha ocurrido un error al verificar el usuario ${error.message}`);
            response.status(400).json({ message: 'No es posible verificar el usuario', error: error.message });
        };
    };

    @Patch('updateUser/:id')
    public async updateUser(@Req() request: Request, @Res() response: Response, @Param() { id }, @Body() userData: UserUpdateDto): Promise<void> {
        try {
            this.logger.log(`[ PATCH ${request.url} ]: Solicitando actualizar el usuario`);
            const update: UserUpdateDto = await this.userService.updateUser(Number(id),userData);
            const user = await this.userService.getUser(update.email);
            const status = await this.userStatus.updateStatus(user, 3);
            const token = await this.authUtil.getValidationToken({ email: update.email, profile: String(user.profile)})
            response.status(200).json({ message: 'Usuario actualizado con exito debe volverse a validar', status, userUpdatedData: update, validationData: token });
        } catch (error) {
            this.logger.error(`[ PATCH ${request.url} ]: Ha ocurrido un error al actualizar el usuario`);
            response.status(400).json({ message: 'No es posible actualizar el estado', error: error.message });
        };
    };

    @Put('updateStatus')
    public async updateStatus(@Req() request: Request, @Res() response: Response): Promise<void> {
        try {
            const { email, idStatus } = request.query;
            this.logger.log(`[ PUT ${request.url} ]: Solicitando actualizar usuario ${String(email)}`);
            const user: UserPublic = await this.userService.getUser(String(email));
            if (typeof user.email === 'string') {
                const status: string = await this.userStatus.updateStatus({ ...user }, Number(idStatus));
                if (typeof status === 'string'){
                    this.logger.log(`[ PUT ${request.url} ]: Estado actualizado ${status} | ${String(email)}`);
                    response.status(200).json({ message: 'Estado actualizado con éxito', data: { email: user.email, status }, status: true });
                } else { throw new Error('Estado no encontrado') };
            } else { throw new Error('Usuario no encontrado') };
        } catch (error) {
            this.logger.error(`[ PUT ${request.url} ]: Ha ocurrido un error al actualizar el estado`);
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
