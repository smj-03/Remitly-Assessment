import { IBranchSwiftCode } from '../swift-codes.interface';
import { IsString, IsISO31661Alpha2, IsBoolean } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class BranchSwiftCodeCreateDto implements IBranchSwiftCode {
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

@Exclude()
export class BranchSwiftCodeResponseDto implements IBranchSwiftCode {
  @Expose()
  address: string;

  @Expose()
  bankName: string;

  @Expose()
  countryISO2: string;

  @Expose()
  countryName: string;

  @Expose()
  isHeadquarter: boolean;

  @Expose()
  swiftCode: string;
}
