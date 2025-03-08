import { Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { UserPublic } from "../interfaces/user.interfaces";
import { withAccelerate } from "@prisma/extension-accelerate";

export class UserStatusUtil {

    private logger: Logger = new Logger(UserStatusUtil.name);
    private prisma = new PrismaClient().$extends(withAccelerate());

    public async setStatus(user: UserPublic, idStatus: number): Promise<string> {
        try {
            this.logger.log(`[ setStatus() ]: Ingresando estado pendiente a ${user.name} ${user.email}`);
            this.prisma.$connect();
            const setStatus = await this.prisma.userStatus.create({
                select: { status: { select: { name: true}} }, 
                data: { userId: user.id, statusId: idStatus }
            });
            this.logger.log(`[ setStatus() ]: Estado creado ${setStatus.status.name} a ${user.email}`);
            return setStatus.status.name;
        } catch(error) {
            this.logger.error(`[ setStatus() ]: Ha ocurrido un error al ingresar el estado ${error}`);
            return error;
        } finally {
            this.prisma.$disconnect();
        };
    };

    public async updateStatus(user: UserPublic, idStatus: number): Promise<string> {
        try {
            this.logger.log(`[ updateStatus() ]: Actualizando a estado Validado al usuario ${user.email}`);
            this.prisma.$connect();
            const status = await this.prisma.userStatus.updateManyAndReturn({
                select: { status: {select: {name: true}} },
                data: { statusId: idStatus },
                where: { userId: user.id }
            });
            this.logger.log(`[ updateStatus() ]: Estado actualizado ${status[0].status.name} a ${user.email}`);
            return status[0].status.name;
        } catch (error) {
            this.logger.error(`[ updateStatus() ]: Ha ocurrido un error al actualizar el estado ${error}`);
            return error;
        } finally {
            this.prisma.$disconnect();
        };
    };

    public async deleteStatus(user: UserPublic): Promise<boolean> {
        try {
            this.logger.log(`[ deleteStatus() ]: Borrando registro de estado al usuario ${user.email}`);
            this.prisma.$connect();
            const deletion = await this.prisma.userStatus.deleteMany({ where: {userId: user.id} });
            this.logger.log(`[ deleteStatus() ]: Registro eliminado ${deletion}`);
            return true;
        } catch (error) {
            this.logger.error(`[ deleteStatus() ]: Ha ocurrido un error al borrar el registro de estado ${error}`);
            return false;
        } finally {
            this.prisma.$disconnect();
        };
    };

}
