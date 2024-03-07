import { IsString, IsOptional, IsNotEmpty, ValidateIf, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';

export function IsEitherUserOrAdminId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEitherUserOrAdminId',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const user_Id = args.object['user_Id'];
          const admin_Id = args.object['admin_Id'];

          return (user_Id && !admin_Id) || (!user_Id && admin_Id);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Either user_Id or admin_Id should be provided, but not both.';
        },
      },
    });
  };
}

