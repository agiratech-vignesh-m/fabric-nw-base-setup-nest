// fabric.service.ts
import * as fs from 'fs';
import * as path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as crypto from 'crypto';
import {
  ConnectOptions,
  Identity,
  Signer,
  signers,
} from '@hyperledger/fabric-gateway';
import { Injectable } from '@nestjs/common';
import FabricCAServices = require('fabric-ca-client');

@Injectable()
export class FabricService {
  async getCCP(org: string): Promise<any> {
    let ccp: any;
    switch (org) {
      case 'excelsior':
        ccp = this.buildCCPOrg1();
        break;
      case 'atic':
        ccp = this.buildCCPOrg2();
        break;
      case 'atrms':
        ccp = this.buildCCPOrg3();
        break;
      default:
        throw new Error(`Unknown organization: ${org}`);
    }
    return ccp;
  }

  private buildCCPOrg1(): any {
    const ccpPath = path.resolve(
      __dirname,
      '../../../connection-profile/connection-excelsior.json',
    );
    return this.buildCCP(ccpPath);
  }

  private buildCCPOrg2(): any {
    const ccpPath = path.resolve(
      __dirname,
      '../../../connection-profile/connection-atic.json',
    );
    return this.buildCCP(ccpPath);
  }

  private buildCCPOrg3(): any {
    const ccpPath = path.resolve(
      __dirname,
      '../../../connection-profile/connection-atrms.json',
    );
    return this.buildCCP(ccpPath);
  }

  private buildCCP(ccpPath: string): any {
    const fileExists = fs.existsSync(ccpPath);
    if (!fileExists) {
      throw new Error(`no such file or directory: ${ccpPath}`);
    }
    const contents = fs.readFileSync(ccpPath, 'utf8');
    return JSON.parse(contents);
  }

  async buildCAClient(ccp: any, caHostName: string) {
    const caInfo = ccp.certificateAuthorities[caHostName];
    const caTLSCACerts = caInfo.tlsCACerts.pem;

    return new FabricCAServices(
      caInfo.url,
      { trustedRoots: caTLSCACerts, verify: true },
      caInfo.caName,
    );
  }

  async newGrpcConnection(
    peerEndpoint: string,
    tlsRootCert: Buffer,
  ): Promise<grpc.Client> {
    try {
      const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
      const check = new grpc.Client(peerEndpoint, tlsCredentials, {});
      return check;
    } catch (error) {
      console.error('Error creating gRPC connection:', error);
      throw error;
    }
  }

  async newConnectOptions(
    client: grpc.Client,
    mspId: string,
    credentials: Uint8Array,
    privateKeyPem: string,
  ): Promise<ConnectOptions> {
    return {
      client,
      identity: await this.newIdentity(mspId, credentials),
      signer: await this.newSigner(privateKeyPem),
      // Default timeouts for different gRPC calls
      evaluateOptions: () => {
        return { deadline: Date.now() + 5000 }; // 5 seconds
      },
      endorseOptions: () => {
        return { deadline: Date.now() + 15000 }; // 15 seconds
      },
      submitOptions: () => {
        return { deadline: Date.now() + 5000 }; // 5 seconds
      },
      commitStatusOptions: () => {
        return { deadline: Date.now() + 60000 }; // 1 minute
      },
    };
  }

  async newIdentity(mspId: string, credentials: Uint8Array): Promise<Identity> {
    const identity = { mspId, credentials };
    return identity;
  }

  async newSigner(privateKeyPem: string): Promise<Signer> {
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    const sign = signers.newPrivateKeySigner(privateKey);
    return sign;
  }
}
