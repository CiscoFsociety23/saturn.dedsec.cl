import { Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { UserPublic } from "../interfaces/user.interfaces";

export class UserStatusUtil {

    private logger: Logger = new Logger(UserStatusUtil.name);
    private prisma: PrismaClient = new PrismaClient();

    public async setPendingStatus(user: UserPublic): Promise<string> {
        try {
            this.logger.log(`[ setPendingStatus() ]: Ingresando estado pendiente a ${user.name} ${user.email}`);
            this.prisma.$connect();
            const setStatus = await this.prisma.userStatus.create({ select: {
                status: { select: { name: true}}
            }, data: { userId: user.id, statusId: 3 }});
            return setStatus.status.name;
        } catch(error) {
            this.logger.error(`[ setPendingStatus() ]: Ha ocurrido un error al ingresar el estado ${error}`);
            return error;
        } finally {
            this.prisma.$disconnect();
        };
    };

}
