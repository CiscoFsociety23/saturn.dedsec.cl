import { Injectable, Logger } from "@nestjs/common";
import { information, services } from "src/interfaces/saturn.interfaces";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class SaturnService {
    
    private logger: Logger = new Logger(SaturnService.name);
    private prisma: PrismaClient = new PrismaClient();
    private serviceList: services[] = new Array<services>();

    public async information(): Promise<information> {
        try {
            this.logger.log('[ information() ]: Obteniendo informacion del servicio');
            this.prisma.$connect();
            this.serviceList.splice(0, this.serviceList.length);
            this.logger.log('[ information() ]: Obteniendo nombre del servicio');
            const serverName: {value: string}[] = await this.prisma.property.findMany({select: { value: true }, where: { key: 'Server Name' }});
            this.logger.log('[ information() ]: Obteniendo listado de servicios');
            const serviceStatus: { name: string, status: { name: string }}[] = await this.prisma.serviceStatus.findMany({
                select: { name: true, status: { select: { name: true } }}
            });
            serviceStatus.forEach(service => {
                this.serviceList.push({
                    name: service.name,
                    status: service.status.name
                });
            });
            return {
                server: serverName[0].value,
                services: this.serviceList
            };
        } catch (error) {
            this.logger.error(`[ information() ]: Ha ocurrido un error al obtener la informacion ${error}`);
            return error;
        } finally {
            this.prisma.$disconnect();
        };
    };

}
