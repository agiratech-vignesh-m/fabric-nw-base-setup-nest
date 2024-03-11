// fabric-connect.middleware.ts
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { AdminService } from 'src/api/admin/admin.service';
import { FabricService } from 'src/api/fabric/fabric.service'; // Adjust the path as per your project structure
// import { UserService } from 'src/api/user/user.service';
import {
  ChaincodeEvent,
  CloseableAsyncIterable,
  connect,
  Network,
} from '@hyperledger/fabric-gateway';
import { BlockchainException } from 'src/utils/custom_exception.utils';
import { UserService } from 'src/api/user/user.service';
import { chainCodeHelpers } from 'src/utils/chaincode.utils';
import { startEventListening } from 'src/utils/listener.utils';

@Injectable()
export class FabricConnectMiddleware implements NestMiddleware {
  constructor(
    private readonly fabricService: FabricService,
    private readonly adminService: AdminService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const routePath = req.path.split('/').splice(1, 3);
      const key = `/${routePath.join('/')}`;

      const chaincode = chainCodeHelpers[key];
      const { org, admin_Id, user_Id } = req.body;
      let ccp = await this.fabricService.getCCP(org);
      let data: any;
      let details: any
      if (req.body && req.body.admin_Id) {
        data = await this.adminService.getAdmin({admin_Id: admin_Id});
        details = JSON.parse(data.admin_data);
      } else {
        data = await this.userService.getUser({ user_Id: user_Id });
        details = JSON.parse(data.user_data);
      }

      if (!data) {
        console.log('User data not found in database');
        throw new BlockchainException(
          'User data not found in database',
          HttpStatus.UNPROCESSABLE_ENTITY,
          true,
        );
      }

      const peersObject: any = Object.values(ccp.peers);

      let peerEndpoint: string;
      let tlsCertPeers: any;

      if (peersObject.length > 0) {
        const peerEndpointTemp = peersObject[0].url;
        peerEndpoint = peerEndpointTemp
          ? peerEndpointTemp.replace('grpcs://', '')
          : null;
        tlsCertPeers = peersObject[0].tlsCACerts;
      } else {
        throw new BlockchainException(
          'No peer found in CCP configuration',
          HttpStatus.UNPROCESSABLE_ENTITY,
          true,
        );
      }

      let tlsCertContent: string;

      if (tlsCertPeers) {
        tlsCertContent = tlsCertPeers.pem;
      } else {
        throw new BlockchainException(
          'TLS certificate not found in CCP configuration',
          HttpStatus.UNPROCESSABLE_ENTITY,
          true,
        );
      }
      const client = await this.fabricService.newGrpcConnection(
        peerEndpoint,
        Buffer.from(tlsCertContent),
      );

      const mspId = details.mspId;
      const certificate = details.credentials.certificate;
      const privateKey = details.credentials.privateKey;
      console.log("details", details)
      const connectOptions = await this.fabricService.newConnectOptions(
        client,
        mspId,
        Buffer.from(certificate),
        privateKey,
      );
      const channel_name = this.configService.get('channel_name');
      const gateway = connect(connectOptions);
      const network = gateway.getNetwork(channel_name);
      const contract = network.getContract(chaincode);

      (req as any).contract = contract;

      const eventsListener: CloseableAsyncIterable<ChaincodeEvent> | undefined =
        await startEventListening(chaincode, network);
      console.log('eventsListener', eventsListener);
      next();
    } catch (error) {
      console.log('FabricConnectMiddleware - Error', error);
      throw new BlockchainException(
        error?.message,
        HttpStatus.UNPROCESSABLE_ENTITY,
        true,
      );
    }
  }
}
