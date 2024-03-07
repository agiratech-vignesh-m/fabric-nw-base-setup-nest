import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const request = context.switchToHttp().getRequest() as Request;
      const secretKey = request.headers['api-secret-key'];
      const validateKey = this.configService.get<string>('secret_key');
      if (secretKey && secretKey === validateKey) {
        return true;
      }
      throw new HttpException(
        'Failed to authenticate secret',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      console.log("AuthGuard - Error", error)
      throw new HttpException('Failed to authenticate', HttpStatus.BAD_REQUEST);
    }
  }
}
