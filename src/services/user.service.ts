import { Injectable, Logger } from "@nestjs/common";
import { User } from "src/interfaces/user.dto";

@Injectable()
export class UserService {

    private logger: Logger = new Logger(UserService.name);
    private userList: User[] = new Array<User>();     

    public getAllUsers(): User[] {
        this.logger.log('[ getAllUsers() ]: Obteniendo listado de usuarios');
        return this.userList;
    };

    public createUser(user: User): User {
        this.logger.log(`[ createUser() ]: Creando el usuario ${user.name} ${user.lastName}, correo ${user.email}`);
        this.userList.push(user);
        return user;
    };

}
