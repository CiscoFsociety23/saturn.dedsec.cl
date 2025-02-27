import { Injectable, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { User } from "src/interfaces/user.dto";
import { UserCreated } from "src/interfaces/user.interfaces";
import CryptoUtil from "src/utils/cryto.util";

@Injectable()
export class UserService {

    private logger: Logger = new Logger(UserService.name);
    private userList: User[] = new Array<User>();
    private crypto: CryptoUtil = new CryptoUtil();
    private prisma: PrismaClient = new PrismaClient();

    public getAllUsers(): User[] {
        this.logger.log('[ getAllUsers() ]: Obteniendo listado de usuarios');
        return this.userList;
    };

    public async createUser(user: User): Promise<UserCreated> {
        try {
            this.logger.log(`[ createUser() ]: Creando el usuario {${user.name} ${user.lastName}, correo ${user.email}}`);
            const passCrypto: string | undefined = await this.crypto.encrypt(user.passwd);
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
        } catch (e) {
            this.logger.error(`[ createUser() ]: Ha ocurrido un error al crear el usuario {${user.name} ${user.lastName}, correo ${user.email}}`);
            return e;
        }
    };

}
