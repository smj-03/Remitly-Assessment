import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SwiftCode } from '../swift-codes.schema';
import { Model } from 'mongoose';

@ValidatorConstraint({ name: 'IsUniqueConstraint', async: true })
@Injectable()
export class IsUniqueSwiftCodeConstraint implements ValidatorConstraintInterface {
  constructor(@InjectModel(SwiftCode.name) private swiftCodeModel: Model<SwiftCode>) {}

  async validate(value: any): Promise<boolean> {
    const dataExists = await this.swiftCodeModel.findOne({ swiftCode: value }).exec();
    return !dataExists;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `SWIFT code ${validationArguments?.value} already exists`;
  }
}
