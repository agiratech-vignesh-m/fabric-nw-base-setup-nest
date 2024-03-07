import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WEB3AdminsTest } from 'src/entities/admin_test.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { decrypt, encrypt } from 'src/utils/crypto.utils';
import { IX509 } from 'src/utils/interface.helper';
import { error } from 'src/config/yaml.config';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(WEB3AdminsTest)
    private readonly adminTest: Repository<WEB3AdminsTest>,
  ) {}

  async getAdmin(query: any): Promise<any> {
    try {
      const findOptions: FindOneOptions<WEB3AdminsTest> = {
        where: { admin_Id: query },
        // Other options like relations, order, etc. can be added here
      };

      const admin = await this.adminTest.findOne(findOptions);
      if (admin) {
        const data = JSON.parse(admin.admin_data);
        const certificateTemp = data.credentials.certificate;
        const adminCertificateDecrypt = decrypt(certificateTemp);

        const privateKeyTemp = data.credentials.privateKey;
        const adminprivateKeyDecrypt = decrypt(privateKeyTemp);

        // Decrypt data if necessary
        const decryptedData = {
          certificate: adminCertificateDecrypt,
          privateKey: adminprivateKeyDecrypt,
          mspId: data.mspId,
          type: data.type,
        };
        return decryptedData;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error in getAdminIdentityFromDatabase:', error);
      throw new Error(error.message);
    }
  }

  async enrollAdmin(org: string, x509Identity: IX509): Promise<Boolean> {
    try {
      const admin_key = `${org}Admin`;
      const adminDataString = JSON.stringify(x509Identity);

      const data = this.adminTest.create({
        org: org,
        admin_Id: admin_key,
        admin_data: adminDataString,
      });

      const save = await this.adminTest.save(data);
      if (!save) {
        throw new Error(error?.user?.saveFailed);
      }
      return true;
    } catch (error) {
      console.log('error', error);
      throw new Error(error.errors?.[0]?.message || error.message);
    }
  }

  // findAll() {
  //   return `This action returns all admin`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} admin`;
  // }

  // update(id: number, updateAdminDto: UpdateAdminDto) {
  //   return `This action updates a #${id} admin`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} admin`;
  // }
}
