import { Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

export class PropertyUtil {

    private logger: Logger = new Logger(PropertyUtil.name);
    private prisma: PrismaClient = new PrismaClient();

    public async getProperty(key: string): Promise<string | undefined> {
        try {
            this.logger.log(`[ getProperty() ]: Obteniendo propiedad ${key}`);
            this.prisma.$connect();
            const value: { value: string } | null = await this.prisma.property.findFirst({ select: { value: true }, where: { key: key } });
            return value?.value;
        } catch (error) {
            this.logger.error(`[ getProperty() ]: Ha ocurrido un error al obtener la propiedad ${error}`);
        } finally {
            this.prisma.$disconnect();
        };
    };

}