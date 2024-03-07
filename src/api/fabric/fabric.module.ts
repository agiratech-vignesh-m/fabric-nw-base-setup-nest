import { Module } from '@nestjs/common';
import { FabricService } from './fabric.service';
import { ChaincodeService } from './chaincode.service';

@Module({
  providers: [FabricService, ChaincodeService],
  exports: [FabricService, ChaincodeService],
})
export class FabricModule {}
