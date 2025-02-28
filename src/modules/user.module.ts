import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { IsCreatedMiddleware } from '../middlewares/user.middleware';
import { UserService } from '../services/user.service';

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
