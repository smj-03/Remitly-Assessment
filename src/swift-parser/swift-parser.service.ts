import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import { Options, parse } from 'csv-parse/sync';

import { CSVParsedSwiftCode } from './swift-parser.interface';

@Injectable()
export class SwiftParserService {
  public parseSwiftFromCsv(path: string): CSVParsedSwiftCode[] {
    const fileContent = fs.readFileSync(path, { encoding: 'utf-8' });

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

    return parse(fileContent, options) as CSVParsedSwiftCode[];
  }
}
