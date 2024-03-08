import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { GetUserDto, ProfileDto, RegisterDto } from './dto/user.dto';
import { FabricService } from '../fabric/fabric.service';
import { error, success } from 'src/config/yaml.config';
import { BlockchainException } from 'src/utils/custom_exception.utils';
import {
  IChaincodeResponse,
  IStandardResponse,
  IUsersData,
} from 'src/utils/interface.helper';
import { ChaincodeService } from '../fabric/chaincode.service';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fabricService: FabricService,
    private readonly chaincodeService: ChaincodeService,
  ) {}

  @Post('enrollUser')
  async enrollUser(@Body() body: RegisterDto): Promise<IStandardResponse> {
    const org = body.org;
    const id = body.user_Id;
    try {
      const validate = await this.userService.getUser({user_Id: id});
      if (validate) {
        throw new Error(error?.user.alreadyExists);
      }

      let ccp = await this.fabricService.getCCP(org);
      const caClient = await this.fabricService.buildCAClient(ccp, `ca-${org}`);

      const register = await this.userService.enrollUser(caClient, org, id);

      if (!register) {
        throw new Error(error.standardError);
      }
      console.log('User registered successfully');
      return {
        message: success?.user?.registered,
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.log('Error', error);
      throw new BlockchainException(
        error.message,
        HttpStatus.UNPROCESSABLE_ENTITY,
        true,
      );
    }
  }

  @Post('get_user')
  async getUser(
    // @Query('user_Id') user_Id: string
    @Body() body: GetUserDto,
  ) {
    return await this.userService.getUser({ user_Id: body.user_Id });
  }

  @Get('get_all_users')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Post('profile')
  async profile(
    @Req() req: Request,
    @Body() body: ProfileDto,
  ): Promise<IChaincodeResponse> {
    const contract = (req as any).contract;
    try {
      const walletAddress: string = await this.chaincodeService.query(
        contract,
        'ClientAccountID',
      );
      const result = await this.chaincodeService.invoke(
        contract,
        'Profile',
        walletAddress,
        body.first_name,
        body.last_name,
        body.email,
        body.mobile_number,
      );
      if (!result) {
        throw new Error(error.message);
      }
      const response = JSON.parse(result);
      return {
        data: response,
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.log('Error', error);
      throw new BlockchainException(
        error.message,
        HttpStatus.UNPROCESSABLE_ENTITY,
        true,
      );
    }
  }

  @Post('get_profile_details')
  async getProfileDetailsByAddress(
    @Req() req: Request,
    @Body() body: RegisterDto,
  ) {
    const contract = (req as any).contract;
    try {
      const walletAddress: string = await this.chaincodeService.query(
        contract,
        'ClientAccountID',
      );
      const result = await this.chaincodeService.query(
        contract,
        'GetProfileDetailsByAddress',
        walletAddress,
      );
      if (!result) {
        throw new Error(error.message);
      }
      const response = JSON.parse(result);
      return {
        data: response,
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.log('get_profile_details error', error);
      throw new BlockchainException(
        error.message,
        HttpStatus.UNPROCESSABLE_ENTITY,
        true,
      );
    }
  }
}
