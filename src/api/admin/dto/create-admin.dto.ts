import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty({ message: 'org is required' })
  @IsString({ message: 'org must be a valid string' })
  org: string;

  @IsNotEmpty({ message: 'admin ID is required' })
  @IsString({ message: 'admin ID must be a valid string' })
  admin_Id: string;

  @IsNotEmpty({ message: 'admin secret is required' })
  admin_secret: string;
}

export class GetAdminDto {
  // @IsNotEmpty({ message: 'Org is required' })
  // @IsString({ message: 'Org must be a valid string' })
  // org: string;

  @IsNotEmpty({ message: 'User Id is required' })
  @IsString({ message: 'User ID should be a string' })
  admin_Id: string;
}
