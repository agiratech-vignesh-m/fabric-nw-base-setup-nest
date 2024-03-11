import { IsString, IsOptional, IsNotEmpty, ValidateIf } from 'class-validator';
import { IsEitherUserOrAdminId } from './validate.dto';

export class RegisterDto {
  @IsNotEmpty({ message: 'Org is required' })
  @IsString({ message: 'Org must be a valid string' })
  org: string;

  @IsOptional()
  @IsEitherUserOrAdminId()
  @IsString({ message: 'User ID should be a string' })
  user_Id?: string;

  @IsOptional()
  @IsEitherUserOrAdminId()
  @IsString({ message: 'Admin ID should be a string' })
  admin_Id?: string;
}

export class GetUserDto {
  // @IsNotEmpty({ message: 'Org is required' })
  // @IsString({ message: 'Org must be a valid string' })
  // org: string;

  @IsNotEmpty({ message: 'User Id is required' })
  @IsString({ message: 'User ID should be a string' })
  user_Id: string;
}

export class ProfileDto {
  @IsNotEmpty({ message: 'Org is required' })
  @IsString({ message: 'Org must be a valid string' })
  org: string;

  // @IsNotEmpty({ message: 'User Id is required' })
  // @IsString({ message: 'User ID should be a string' })
  // user_Id: string;
  
  @IsOptional()
  @IsEitherUserOrAdminId()
  @IsString({ message: 'User ID should be a string' })
  user_Id?: string;

  @IsOptional()
  @IsEitherUserOrAdminId()
  @IsString({ message: 'Admin ID should be a string' })
  admin_Id?: string;

  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name should be a string' })
  first_name: string;

  @IsOptional()
  @IsString({ message: 'Last name should be a string' })
  last_name?: string;
  
  @IsOptional()
  @IsString({ message: 'Email should be a string' })
  email?: string;

  @IsNotEmpty({ message: 'Mobile number is required' })
  @IsString({ message: 'Mobile number should be a string' })
  mobile_number: string;

}
