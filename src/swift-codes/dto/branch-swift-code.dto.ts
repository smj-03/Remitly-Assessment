import { IBranchSwiftCode } from '../swift-codes.interface';
import { IsString, IsISO31661Alpha2, IsBoolean } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { BaseSwiftCodeResponseDto } from './base-swift-code.dto';

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
export class BranchSwiftCodeResponseDto
  extends BaseSwiftCodeResponseDto
  implements IBranchSwiftCode
{
  @Expose()
  countryName: string;
}
