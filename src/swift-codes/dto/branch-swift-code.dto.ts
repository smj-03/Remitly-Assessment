import { IBranchSwiftCode } from '../swift-codes.interface';
import { IsString, IsISO31661Alpha2, IsBoolean } from 'class-validator';

export class BranchSwiftCodeDto implements IBranchSwiftCode {
  @IsString()
  address: string;

  @IsString()
  bankName: string;

  @IsISO31661Alpha2()
  countryISO2: string;

  @IsString()
  countryName: string;

  @IsBoolean()
  isHeadquarter: boolean;

  @IsString()
  swiftCode: string;
}
