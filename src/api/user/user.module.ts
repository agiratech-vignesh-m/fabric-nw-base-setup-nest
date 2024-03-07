import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WEB3AdminsTest } from 'src/entities/admin_test.entity';
import { FabricConnectMiddleware } from 'src/middleware/cc-connect.middleware';
import { FabricService } from '../fabric/fabric.service';
import { AdminService } from '../admin/admin.service';
import { WEB3UsersTest } from 'src/entities/user.entity';
import { FabricModule } from '../fabric/fabric.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WEB3AdminsTest, 
      WEB3UsersTest
    ]),
    FabricModule
],
  controllers: [UserController],
  providers: [
    UserService,
    AdminService
  ],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FabricConnectMiddleware)
      .exclude({
        path: 'user/enrollUser',
          method: RequestMethod.POST,
          version: '1',
      },
      {
        path: 'user/get_user',
          method: RequestMethod.GET,
          version: '1',
      },
      {
        path: 'user/get_all_users',
          method: RequestMethod.GET,
          version: '1',
      })
      .forRoutes(UserController);
  }
}
