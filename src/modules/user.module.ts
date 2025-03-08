import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { IsCreatedMiddleware, VerifyAdminProfile } from '../middlewares/user.middleware';
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
        consumer.apply(VerifyAdminProfile).forRoutes(
            {
                path: '/api-saturn/users',
                method: RequestMethod.GET
            },
            {
                path: '/api-saturn/users',
                method: RequestMethod.POST
            },
            {
                path: '/api-saturn/users/updateUser/:id',
                method: RequestMethod.PATCH
            },
            {
                path: '/api-saturn/users/updateStatus',
                method: RequestMethod.PUT
            },
            {
                path: '/api-saturn/users',
                method: RequestMethod.DELETE
            }
        );
    };

}
