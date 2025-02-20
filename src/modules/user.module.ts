import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserController } from 'src/controllers/user.controller';
import { IsCreatedMiddleware } from 'src/middlewares/isCreated.middleware';
import { UserService } from 'src/services/user.service';

@Module({
    controllers: [UserController],
    providers: [UserService]
})
export class UsersModule implements NestModule {
    
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(IsCreatedMiddleware).forRoutes({
            path: '/api-saturn/users',
            method: RequestMethod.POST
        });
    };

}
