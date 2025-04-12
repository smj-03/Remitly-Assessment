import { IHeadquarterSwiftCode } from '../swift-codes.interface';
import { Exclude, Expose, Type } from 'class-transformer';
import { BaseSwiftCodeResponseDto } from './base-swift-code.dto';
import { BranchSwiftCodeResponseDto } from './branch-swift-code.dto';

@Exclude()
export class HeadquarterSwiftCodeResponseDto
  extends BranchSwiftCodeResponseDto
  implements IHeadquarterSwiftCode
{
  @Expose()
  @Type(() => BaseSwiftCodeResponseDto)
  branches: BaseSwiftCodeResponseDto[];
}
