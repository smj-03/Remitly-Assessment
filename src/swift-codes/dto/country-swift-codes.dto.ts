import { ICountrySwiftCodes } from '../swift-codes.interface';
import { Exclude, Expose, Type } from 'class-transformer';
import { BaseSwiftCodeResponseDto } from './base-swift-code.dto';

@Exclude()
export class CountrySwiftCodesDto implements ICountrySwiftCodes {
  @Expose()
  countryISO2: string;

  @Expose()
  countryName: string;

  @Expose()
  @Type(() => BaseSwiftCodeResponseDto)
  swiftCodes: BaseSwiftCodeResponseDto[];
}
