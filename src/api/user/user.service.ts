import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import FabricCAServices from 'fabric-ca-client';
import { WEB3UsersTest } from 'src/entities/user.entity';
import { decrypt, encrypt } from 'src/utils/crypto.utils';
import { IAdminConfig, IUsersData } from 'src/utils/interface.helper';
import { Repository } from 'typeorm';
import { AdminService } from '../admin/admin.service';
import { error } from 'src/config/yaml.config';
import { User } from 'fabric-common';
import { BlockchainException } from 'src/utils/custom_exception.utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(WEB3UsersTest)
    private readonly web3UsersTestRepository: Repository<WEB3UsersTest>,
    private readonly configService: ConfigService,
    private readonly adminService: AdminService,
  ) {}

  async getUser(query: any): Promise<any> {
    console.log("query", query)
    try {
      const user = await this.web3UsersTestRepository.findOne({
        where: query,
      });

      if (user) {
        const data = JSON.parse(user.user_data);
        const certificateTemp = data.credentials.certificate;
        const userCertificateDecrypt = decrypt(certificateTemp);

        const privateKeyTemp = data.credentials.privateKey;
        const userPrivateKeyDecrypt = decrypt(privateKeyTemp);

        // Update the credentials in the user_data with decrypted values
        data.credentials.certificate = userCertificateDecrypt;
        data.credentials.privateKey = userPrivateKeyDecrypt;

        // Update the user_data in the user object
        user.user_data = JSON.stringify(data);

        // Return the modified user object
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error in getUserIdentityFromDatabase:', error);
      throw new Error(error.message);
    }
  }

  async getAllUsers(): Promise<any[]> {
    try {
      const users = await this.web3UsersTestRepository.find();

      if (users) {
        const decryptedUsers = users.map((user) => {
          const data = JSON.parse(user.user_data);
          const certificateTemp = data.credentials.certificate;
          const userCertificateDecrypt = decrypt(certificateTemp);

          const privateKeyTemp = data.credentials.privateKey;
          const userPrivateKeyDecrypt = decrypt(privateKeyTemp);

          // Update the credentials in the user_data with decrypted values
          data.credentials.certificate = userCertificateDecrypt;
          data.credentials.privateKey = userPrivateKeyDecrypt;

          // Update the user_data in the user object
          user.user_data = JSON.stringify(data);

          // Decrypt data if necessary
          const test = JSON.parse(user.user_data);

          return user;
        });
        return decryptedUsers;
      } else {
        throw new Error(error?.user?.dataNotFound);
      }
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      throw new BlockchainException(
        error.message,
        HttpStatus.UNPROCESSABLE_ENTITY,
        true,
      );
    }
  }

  async enrollUser(
    caClient: FabricCAServices,
    org: string,
    user_Id: string,
  ): Promise<Boolean> {
    try {
      const orgMspId = org + 'MSP';

      // Currently we are having the same credential details for all three admins, if we are changing it need to add conditional rendering.
      const admin_Id = this.configService.get<IAdminConfig>('admin').id;
      const admin_secret = this.configService.get<IAdminConfig>('admin').secret;
      const adminUserKey = `${org}Admin`;

      const admin_Identity = await this.adminService.getAdmin({admin_Id: adminUserKey});
      const admin_credentials = JSON.parse(admin_Identity.admin_data);

      if (!admin_Identity) {
        throw new Error(error?.admin?.identityNotFound);
      }

      const adminUser = User.createUser(
        admin_Id,
        admin_secret,
        admin_credentials.mspId,
        admin_credentials.credentials.certificate,
        admin_credentials.credentials.privateKey,
      );

      const secret = await caClient.register(
        {
          affiliation: '',
          enrollmentID: user_Id,
          role: 'client',
          attrs: [],
          maxEnrollments: -1,
        },
        adminUser,
      );

      const enrollment = await caClient.enroll({
        enrollmentID: user_Id,
        enrollmentSecret: secret,
      });

      const encryptedCertificate = encrypt(enrollment.certificate);
      const encryptedPrivateKey = encrypt(enrollment.key.toBytes());

      const x509Identity = {
        credentials: {
          certificate: encryptedCertificate,
          privateKey: encryptedPrivateKey,
        },
        mspId: orgMspId,
        type: 'X.509',
      };

      const userDataString = JSON.stringify(x509Identity);

      const data = this.web3UsersTestRepository.create({
        org: org,
        user_Id: user_Id,
        user_data: userDataString,
      });

      const save = await this.web3UsersTestRepository.save(data);
      if (!save) {
        throw new Error(error?.user?.saveFailed);
      }
      return true;
    } catch (error) {
      throw new Error(error.errors?.[0]?.message || error.message);
    }
  }
}
