import { IBranchSwiftCode } from '../swift-codes.interface';
import { IsString, IsISO31661Alpha2, IsBoolean, IsBIC, IsNotEmpty } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { BaseSwiftCodeResponseDto } from './base-swift-code.dto';
import { IsUniqueSwiftCode } from '../validators/is-unique-swift-code.decorator';

export class BranchSwiftCodeCreateDto implements IBranchSwiftCode {
  @IsString()
  address: string;

  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsISO31661Alpha2()
  countryISO2: string;

  @IsString()
  @IsNotEmpty()
  countryName: string;

  @IsBoolean()
  isHeadquarter: boolean;

  @IsBIC()
  @IsUniqueSwiftCode()
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
