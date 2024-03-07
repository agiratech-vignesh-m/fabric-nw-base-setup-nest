import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { FabricModule } from './fabric/fabric.module';

@Module({
  imports: [
    AdminModule, 
    UserModule,
    FabricModule
  ],
  exports: [],
  // If other modules uses the common serive then we need to declare it here
  providers: [],
})
export class ApiModule {}
