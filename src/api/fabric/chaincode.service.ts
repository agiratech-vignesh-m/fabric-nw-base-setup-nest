import { Injectable } from '@nestjs/common';
import { Contract } from '@hyperledger/fabric-gateway';
import { handleErrorMessage } from 'src/utils/chaincode.utils';

@Injectable()
export class ChaincodeService {
  async invoke(contract: Contract, name: string, ...args: any[]): Promise<any> {
    try {
      const invokeResult = await contract.submitTransaction(name, ...args);
      const result = Buffer.from(invokeResult).toString('utf-8');
      return result;
    } catch (error) {
      // Iterate over the error details and return the first error message encountered
      const errorMessage = handleErrorMessage(error);
      console.log('errorMessage', errorMessage);
      throw new Error(errorMessage);
    }
  }

  async query(contract: Contract, name: string, ...args: any[]): Promise<any> {
    try {
      const queryResult = await contract.evaluateTransaction(name, ...args);

      const result = Buffer.from(queryResult).toString('utf-8');
      return result;
    } catch (error) {
      // Iterate over the error details and return the first error message encountered
      const errorMessage = handleErrorMessage(error);
      throw new Error(errorMessage);
    }
  }
}
