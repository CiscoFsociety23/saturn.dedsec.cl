import { Injectable, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { UserDto, UserTokenDto, UserUpdateDto } from "../interfaces/user.dto";
import { LogIn, UserPublic } from "../interfaces/user.interfaces";
import CryptoUtil from "../utils/cryto.util";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class UserService {

    private logger: Logger = new Logger(UserService.name);
    private userList: UserPublic[] = new Array<UserPublic>();
    private crypto: CryptoUtil = new CryptoUtil();
    private prisma = new PrismaClient().$extends(withAccelerate());

    public async getAllUsers(): Promise<UserPublic[]> {
        try {
            this.logger.log('[ getAllUsers() ]: Obteniendo listado de usuarios');
            this.prisma.$connect();
            this.userList.splice(0, this.userList.length);
            const users = await this.prisma.users.findMany({
                select: {id: true, name: true, lastName: true, email: true, profile: {select: {profile: true}}, userStatus: {include:{status:{select:{name:true}}}}}
            });
            users.forEach(async user => {
                if(user.userStatus.length > 0){
                    this.userList.push({ id: user.id, name: user.name, lastName: user.lastName, email: user.email, profile: user.profile.profile, status: user.userStatus[0].status.name });
                } else {
                    this.userList.push({ id: user.id, name: user.name, lastName: user.lastName, email: user.email, profile: user.profile.profile, status: 'null' });
                };
            });
            return this.userList;
        } catch (error) {
            this.logger.error(`[ getAllUsers() ]: Ha ocurrido un error al obtener los usuarios ${error}`);
            return error;
        } finally {
            this.prisma.$disconnect();
        };
    };

    public async getUser(email: string): Promise<UserPublic> {
        try {
            this.logger.log(`[ getUser() ]: Obteniendo usuario ${email}`);
            this.prisma.$connect();
            const user = await this.prisma.users.findFirst({ select: {
                id: true, name: true, lastName: true, email: true, profile: { select: { profile: true }}, userStatus: {include:{status:{select:{name:true}}}}
            }, where: { email: email }});
            if(user?.email === email){
                if(Number(user?.userStatus.length) > 0){
                    return { id: Number(user?.id), name: String(user?.name), lastName: String(user?.lastName), email: String(user?.email), profile: String(user?.profile.profile), status: String(user?.userStatus[0].status.name) };
                } else {
                    return { id: Number(user?.id), name: String(user?.name), lastName: String(user?.lastName), email: String(user?.email), profile: String(user?.profile.profile), status: 'null' };
                };
            } else { throw new Error('Usuario no encontrado'); };
        } catch (error) {
            this.logger.error(`[ getUser() ]: Ha ocurrido un error al obtener el usuario ${error}`);
            return error;
        } finally {
            this.prisma.$disconnect();
        };
    };

    public async createUser(user: UserDto): Promise<UserPublic> {
        try {
            this.logger.log(`[ createUser() ]: Creando el usuario {${user.name} ${user.lastName}, correo ${user.email}}`);
            const passCrypto: string | undefined = await this.crypto.encrypt(user.passwd);
            this.prisma.$connect();
            const createdUser = await this.prisma.users.create({ select: {
                id: true, name: true, lastName: true, email: true, profile: {select: {profile: true}}
            }, data: {
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                passwd: String(passCrypto),
                profile: { connect: { 
                    id: user.profile
                }}
            }});
            return { id: createdUser.id, name: createdUser.name, lastName: createdUser.lastName, email: createdUser.email, profile: createdUser.profile.profile, status: '' };
        } catch (error) {
            this.logger.error(`[ createUser() ]: Ha ocurrido un error al crear el usuario ${error}`);
            return error;
        } finally {
            this.prisma.$disconnect();
        };
    };

    public async updateUser(id: number, userData: UserUpdateDto): Promise<UserUpdateDto> {
        try {
            this.logger.log(`[ updateUser() ]: Actualizando usuario ${String(id)}`);
            const userUpdate = await this.prisma.users.update({
                where: {id},
                data: { id: undefined, ...userData }
            });
            this.logger.log(`[ updateUser() ]: Usuario ${userUpdate.name} actualizado con exito`);
            return userUpdate;
        } catch (error) {
            this.logger.error(`[ updateUser() ]: Ha ocurrido un error al actualizar el usuario ${error.message}`);
            return error;
        };
    };

    public async getUserStatus(email: string): Promise<string | undefined> {
        try {
            this.logger.log(`[ getUserStatus() ]: Buscando estado del usuario ${email}`);
            const user = await this.getUser(email);
            this.prisma.$connect();
            const status = await this.prisma.userStatus.findFirst({
                select: {status: {select: {name:true}}},
                where: {userId:user.id}
            });
            this.logger.log(`[ getUserStatus() ]: El estado del usuario es ${String(status?.status.name)}`);
            return status?.status.name;
        } catch (error) {
            this.logger.error(`[ getUserStatus() ]: Ha ocurrido un error al obtener el estado ${error.message}`);
            return error;
        } finally {
            this.prisma.$disconnect();
        };
    };

    public async getDataToken(token: string): Promise<UserTokenDto> {
        try {
            this.logger.log(`[ getDataToken() ]: Obteniendo datos del token`);
            const payloadBase64 = String(token).split(".")[1];
            const decodedString = Buffer.from(String(payloadBase64), 'base64').toString('utf-8');
            this.logger.log(`[ getDataToken() ]: Datos obtenido ${decodedString}`);
            const parsedData = JSON.parse(decodedString);
            const userDataToken = plainToInstance(UserTokenDto, parsedData);
            await validate(userDataToken);
            return userDataToken;
        } catch (error) {
            this.logger.error(`[ getDataToken() ]: Ha ocurrido un error al validar el usaurio ${error.messsage}`);
            return error;
        };
    };

    public async verificateUser(logInData: LogIn): Promise<boolean> {
        try {
            this.logger.log(`[ verificateUser() ]: Verificando credenciales del usuario ${logInData.email}`);
            this.prisma.$connect();
            const getUserData = await this.prisma.users.findFirst({
                select: { email: true, passwd: true },
                where: { email: logInData.email }
            });
            if (getUserData == null){
                this.logger.warn(`[ verificateUser() ]: Usuario ${logInData.email} no registrado`);
                throw new Error('Usuario no encontrado');
            } else {
                this.logger.log(`[ verificateUser() ]: Verificando datos del usuario ${logInData.email}`);
                const passDecryp = await this.crypto.decrypt(getUserData.passwd);
                if(passDecryp === logInData.passwd){
                    this.logger.log(`[ verificateUser() ]: Acceso para el usuario ${logInData.email} OK`);
                    return true;
                } else {  this.logger.warn(`[ verificateUser() ]: Contraseña incorrecta`); throw new Error('Contraseña inválida'); }
            };
        } catch (error) {
            this.logger.error(`[ verificateUser() ]: Ha ocurrido un error al verificar las credenciales del usuario ${error.message}`);
            return error;
        } finally {
            this.prisma.$disconnect();
        }
    };

    public async deleteUser(user: UserPublic): Promise<boolean> {
        try {
            this.logger.log(`[ deleteUser() ]: Eliminando usuario con id ${user.id}, email ${user.email}`);
            this.prisma.$connect();
            const deletion = await this.prisma.users.delete({ where: {id: user.id}});
            this.logger.log(`[ deleteUser() ]: Usuario eliminado ${deletion}`);
            return true;
        } catch (error) {
            this.logger.error(`[ deleteUser() ]: Ha ocurrido un error al eliminar el usuario ${error}`);
            return false;
        } finally {
            this.prisma.$disconnect();
        };
    };

}
