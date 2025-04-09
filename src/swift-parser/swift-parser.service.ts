import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import { Options, parse } from 'csv-parse/sync';

import { BranchSwiftCode } from '../swift-codes/swift-codes.interface';

@Injectable()
export class SwiftParserService {
  public parseSwiftFromCsv(path: string): BranchSwiftCode[] {
    const fileContent = fs.readFileSync(path, { encoding: 'utf-8' });

    // REDUNDANT: CODE TYPE, TOWN NAME, TIME ZONE
    // COUNTRY ISO2 CODE,SWIFT CODE,CODE TYPE,NAME,ADDRESS,TOWN NAME,COUNTRY NAME,TIME ZONE

    const headers: string[] = [
      'countryISO2',
      'swiftCode',
      'codeType',
      'bankName',
      'address',
      'townName',
      'countryName',
      'timeZone',
    ];

    const options: Options = { delimiter: ',', columns: headers, fromLine: 2 };

    return parse(fileContent, options) as BranchSwiftCode[];
  }
}
