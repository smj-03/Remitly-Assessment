import { IBranchSwiftCode } from '../swift-codes/swift-codes.interface';

export interface ICSVSwiftCode extends IBranchSwiftCode {
  codeType: string;
  townName: string;
  timeZone: string;
}
