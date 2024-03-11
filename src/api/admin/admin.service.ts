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
    private readonly web3adminTestRepository: Repository<WEB3AdminsTest>,
  ) {}

  async getAdmin(query: any): Promise<any> {
    try {
      const admin = await this.web3adminTestRepository.findOne({
        where: query,
      });
      if (admin) {
        const data = JSON.parse(admin.admin_data);
        const certificateTemp = data.credentials.certificate;
        const adminCertificateDecrypt = decrypt(certificateTemp);

        const privateKeyTemp = data.credentials.privateKey;
        const adminprivateKeyDecrypt = decrypt(privateKeyTemp);
        data.credentials.certificate = adminCertificateDecrypt;
        data.credentials.privateKey = adminprivateKeyDecrypt;

        admin.admin_data = JSON.stringify(data);
        return admin;
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

      const data = this.web3adminTestRepository.create({
        org: org,
        admin_Id: admin_key,
        admin_data: adminDataString,
      });

      const save = await this.web3adminTestRepository.save(data);
      if (!save) {
        throw new Error(error?.user?.saveFailed);
      }
      return true;
    } catch (error) {
      console.log('error', error);
      throw new Error(error.errors?.[0]?.message || error.message);
    }
  }
}
