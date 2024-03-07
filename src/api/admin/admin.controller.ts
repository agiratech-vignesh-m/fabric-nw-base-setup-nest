import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  Query,
  HttpException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { FabricService } from '../fabric/fabric.service';
import { encrypt } from 'src/utils/crypto.utils';
import { BlockchainException } from 'src/utils/custom_exception.utils';
import { error, success } from 'src/config/yaml.config';
import { IStandardResponse } from 'src/utils/interface.helper';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly fabric: FabricService,
  ) {}

  @Post('enrollAdmin')
  async enrollAdmin(
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<IStandardResponse> {
    try {
      let org = createAdminDto.org;
      let admin_Id = createAdminDto.admin_Id;
      let admin_secret = createAdminDto.admin_secret;
      const orgMspId = org + 'MSP';
      const admin_key = `${org}Admin`;

      const validate = await this.adminService.getAdmin(admin_key);
      if (validate) {
        throw new Error(error?.admin?.alreadyExists);
      }

      let ccp = await this.fabric.getCCP(org);
      const caClient = await this.fabric.buildCAClient(ccp, `ca-${org}`);

      const enrollment = await caClient.enroll({
        enrollmentID: admin_Id,
        enrollmentSecret: admin_secret,
      });

      const encryptedCertificate = encrypt(enrollment.certificate);
      const encryptedPrivateKey = encrypt(enrollment.key.toBytes());

      // Create an object with the identity information
      const x509Identity = {
        credentials: {
          certificate: encryptedCertificate,
          privateKey: encryptedPrivateKey,
        },
        mspId: orgMspId,
        type: 'X.509',
      };

      const register = await this.adminService.enrollAdmin(org, x509Identity);
      if (!register) {
        throw new Error(error?.standardError);
      }
      return { message: success?.admin?.created, status: HttpStatus.OK };
    } catch (error) {
      console.log('error', error);
      throw new BlockchainException(
        error.message,
        HttpStatus.UNPROCESSABLE_ENTITY,
        true,
      );
    }
  }

  @Get('/')
  getAdmin(@Query('admin_Id') admin_Id: string) {
    try {
      return this.adminService.getAdmin(admin_Id);
    } catch (error) {
      console.log('error', error);
      throw new BlockchainException(
        error.message,
        HttpStatus.UNPROCESSABLE_ENTITY,
        true,
      );
    }
  }
}
