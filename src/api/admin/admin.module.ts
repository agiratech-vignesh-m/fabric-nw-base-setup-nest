import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WEB3AdminsTest } from 'src/entities/admin_test.entity';
import { FabricService } from '../fabric/fabric.service';

@Module({
  imports: [TypeOrmModule.forFeature([WEB3AdminsTest])],
  controllers: [AdminController],
  providers: [AdminService, FabricService],
})
export class AdminModule {}
