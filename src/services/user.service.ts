import { Injectable, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { User } from "../interfaces/user.dto";
import { UserPublic } from "../interfaces/user.interfaces";
import CryptoUtil from "../utils/cryto.util";

@Injectable()
export class UserService {

    private logger: Logger = new Logger(UserService.name);
    private userList: UserPublic[] = new Array<UserPublic>();
    private crypto: CryptoUtil = new CryptoUtil();
    private prisma: PrismaClient = new PrismaClient();

    public async getAllUsers(): Promise<UserPublic[]> {
        try {
            this.logger.log('[ getAllUsers() ]: Obteniendo listado de usuarios');
            this.prisma.$connect();
            this.userList.splice(0, this.userList.length);
            const users: {id: number, name: string, lastName: string, email: string, profile: {profile: string}}[] = await this.prisma.users.findMany({ select: {
                id: true, name: true, lastName: true, email: true, profile: {select: {profile: true}}
            }});
            users.forEach(user => {
                this.userList.push({ id: user.id, name: user.name, lastName: user.lastName, email: user.email, profile: user.profile.profile });
            });
            return this.userList;
        } catch (error) {
            this.logger.error(`[ getAllUsers() ]: Ha ocurrido un error al obtener los usuarios ${error}`);
            return error;
        } finally {
            this.prisma.$disconnect();
        };
    };

    public async createUser(user: User): Promise<UserPublic> {
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
            }})
            return { id: createdUser.id, name: createdUser.name, lastName: createdUser.lastName, email: createdUser.email, profile: createdUser.profile.profile };
        } catch (error) {
            this.logger.error(`[ createUser() ]: Ha ocurrido un error al crear el usuario ${error}`);
            return error;
        } finally {
            this.prisma.$disconnect();
        };
    };

}
