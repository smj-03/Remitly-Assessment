import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsUniqueSwiftCodeConstraint } from './is-unique-swift-code.constraint';

export function IsUniqueSwiftCode(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueSwiftCodeConstraint,
    });
  };
}
