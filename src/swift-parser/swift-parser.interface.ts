import { ISwiftCode } from '../swift-codes/swift-codes.interface';

export interface ICSVSwiftCode extends ISwiftCode {
  codeType: string;
  townName: string;
  timeZone: string;
}
