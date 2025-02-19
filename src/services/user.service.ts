import { Injectable, Logger } from "@nestjs/common";
import { User } from "src/interfaces/user.interface";

@Injectable()
export class UserService {

    private logger: Logger = new Logger(UserService.name);
    private userList: User[];     

    public getAllUsers(): User[] {
        this.logger.log('[ getAllUsers() ]: Obteniendo listado de usuarios');
        return this.userList;
    };

}
