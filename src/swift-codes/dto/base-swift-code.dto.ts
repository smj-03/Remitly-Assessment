import { Exclude, Expose } from 'class-transformer';
import { IBaseSwiftCode } from '../swift-codes.interface';

@Exclude()
export class BaseSwiftCodeResponseDto implements IBaseSwiftCode {
  @Expose()
  address: string;

  @Expose()
  bankName: string;

  @Expose()
  countryISO2: string;

  @Expose()
  isHeadquarter: boolean;

  @Expose()
  swiftCode: string;
}
