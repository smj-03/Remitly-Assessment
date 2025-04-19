import { Test, TestingModule } from '@nestjs/testing';
import { InitializationService } from './initialization.service';
import { getModelToken } from '@nestjs/mongoose';
import { SwiftCode } from '../swift-codes/swift-codes.schema';
import { SwiftParserService } from '../swift-parser/swift-parser.service';
import { Logger } from '@nestjs/common';

const mockSwiftParserService = {
  parseSwiftFromCsv: jest.fn(),
};

const mockSwiftCodeModel = {
  deleteMany: jest.fn(),
  insertMany: jest.fn(),
};

const loggerSpyError = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

describe('InitializationService', () => {
  let service: InitializationService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InitializationService,
        { provide: SwiftParserService, useValue: mockSwiftParserService },
        { provide: getModelToken(SwiftCode.name), useValue: mockSwiftCodeModel },
      ],
    }).compile();

    service = module.get<InitializationService>(InitializationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should successfully populate the database', async () => {
      const mockParsedSwiftCodes = [
        { swiftCode: 'ABC123', countryISO2: 'US' },
        { swiftCode: 'DEFXXX', countryISO2: 'UK' },
      ];

      mockSwiftParserService.parseSwiftFromCsv.mockReturnValue(mockParsedSwiftCodes);
      mockSwiftCodeModel.deleteMany.mockResolvedValue({});
      mockSwiftCodeModel.insertMany.mockResolvedValue([]);

      await service.onModuleInit();

      expect(mockSwiftParserService.parseSwiftFromCsv).toHaveBeenCalledWith(
        'src/downloads/Interns_2025_SWIFT_CODES.csv',
      );
      expect(mockSwiftCodeModel.deleteMany).toHaveBeenCalledWith({});
      expect(mockSwiftCodeModel.insertMany).toHaveBeenCalledWith([
        { ...mockParsedSwiftCodes[0], isHeadquarter: false },
        { ...mockParsedSwiftCodes[1], isHeadquarter: true },
      ]);
    });

    it('should handle errors and log them', async () => {
      const error = new Error('Test error');
      mockSwiftParserService.parseSwiftFromCsv.mockImplementation(() => {
        throw error;
      });

      await service.onModuleInit();

      expect(mockSwiftCodeModel.deleteMany).not.toHaveBeenCalled();
      expect(mockSwiftCodeModel.insertMany).not.toHaveBeenCalled();
      expect(loggerSpyError).toHaveBeenCalledTimes(1);
    });
  });
});
