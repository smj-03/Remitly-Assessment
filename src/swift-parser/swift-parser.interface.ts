import { BranchSwiftCode } from '../swift-codes/swift-codes.interface';

export interface CSVParsedSwiftCode extends BranchSwiftCode {
  codeType: string;
  townName: string;
  timeZone: string;
}
