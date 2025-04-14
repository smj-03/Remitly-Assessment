import { IBranchSwiftCode } from '../swift-codes/swift-codes.interface';

export interface ICSVSwiftCode extends Omit<IBranchSwiftCode, 'isHeadquarter'> {
  codeType: string;
  townName: string;
  timeZone: string;
}
