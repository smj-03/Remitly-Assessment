import { Test, TestingModule } from '@nestjs/testing';
import { SwiftParserService } from './swift-parser.service';
import * as fs from 'node:fs';

jest.mock('node:fs', () => {
  const mockCsvContent =
    'countryISO2,swiftCode,codeType,bankName,address,townName,countryName,timeZone\nUS,ABC123,BIC,Test Bank,123 Test St,Test Town,United States,UTC-5';

  return { readFileSync: jest.fn().mockReturnValue(mockCsvContent) };
});

describe('SwiftParserService', () => {
  let service: SwiftParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SwiftParserService],
    }).compile();

    service = module.get<SwiftParserService>(SwiftParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should parse CSV content correctly', () => {
    const result = service.parseSwiftFromCsv('mock/path/to/file.csv');

    const expected = [
      {
        countryISO2: 'US',
        swiftCode: 'ABC123',
        codeType: 'BIC',
        bankName: 'Test Bank',
        address: '123 Test St',
        townName: 'Test Town',
        countryName: 'United States',
        timeZone: 'UTC-5',
      },
    ];

    expect(result).toEqual(expected);
    expect(fs.readFileSync).toHaveBeenCalledWith('mock/path/to/file.csv', { encoding: 'utf-8' });
  });
});
