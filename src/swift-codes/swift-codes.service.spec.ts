import { Test, TestingModule } from '@nestjs/testing';
import { SwiftCodesService } from './swift-codes.service';
import { getModelToken } from '@nestjs/mongoose';
import { SwiftCode } from './swift-codes.schema';
import { BranchSwiftCodeResponseDto } from './dto/branch-swift-code.dto';

const mockSwiftCodeModel = {
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  deleteOne: jest.fn(),
  create: jest.fn(),
};

describe('SwiftCodesService', () => {
  let service: SwiftCodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SwiftCodesService,
        { provide: getModelToken(SwiftCode.name), useValue: mockSwiftCodeModel },
      ],
    }).compile();

    service = module.get<SwiftCodesService>(SwiftCodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSwiftCodeByCode', () => {
    it('should return null if swift code is not found', async () => {
      mockSwiftCodeModel.findOne.mockResolvedValue(null);
      const result = await service.getSwiftCodeByCode('ABC123');
      expect(result).toBeNull();
      expect(mockSwiftCodeModel.findOne).toHaveBeenCalledWith({ swiftCode: 'ABC123' });
    });

    it('should return a branch swift code if it is not a headquarter', async () => {
      const mockSwiftCode = { swiftCode: 'ABC123', isHeadquarter: false };
      mockSwiftCodeModel.findOne.mockResolvedValue(mockSwiftCode);
      const result = await service.getSwiftCodeByCode('ABC123');
      expect(result).toEqual(mockSwiftCode);
      expect(mockSwiftCodeModel.findOne).toHaveBeenCalledWith({ swiftCode: 'ABC123' });
    });

    it('should return a headquarter swift code if it is a headquarter', async () => {
      const mockHqSwiftCode = {
        swiftCode: 'ABCXXX',
        isHeadquarter: true,
        toObject: jest.fn().mockReturnThis(),
      };
      const mockBranchSwiftCode = { swiftCode: 'ABC123', isHeadquarter: false };
      const expectedSwiftCode = { ...mockHqSwiftCode, branches: [mockBranchSwiftCode] };

      mockSwiftCodeModel.findOne.mockResolvedValue(mockHqSwiftCode);
      mockSwiftCodeModel.find.mockResolvedValue([mockBranchSwiftCode]);

      const result = await service.getSwiftCodeByCode('ABCXXX');
      expect(result).toEqual(expectedSwiftCode);
      expect(mockSwiftCodeModel.findOne).toHaveBeenCalledWith({ swiftCode: 'ABCXXX' });
    });
  });

  describe('getSwiftCodesByCountryCode', () => {
    it('should return null if no swift codes are found', async () => {
      mockSwiftCodeModel.find.mockResolvedValue([]);
      const result = await service.getSwiftCodesByCountryCode('PL');
      expect(result).toBeNull();
      expect(mockSwiftCodeModel.find).toHaveBeenCalledWith({ countryISO2: 'PL' });
    });

    it('should return country swift codes if found', async () => {
      const mockSwiftCodes = [{ countryName: 'POLAND', countryISO2: 'PL', swiftCode: 'ABC123' }];
      mockSwiftCodeModel.find.mockResolvedValue(mockSwiftCodes);

      const result = await service.getSwiftCodesByCountryCode('US');
      expect(result).toEqual({
        countryName: 'POLAND',
        countryISO2: 'PL',
        swiftCodes: mockSwiftCodes,
      });
      expect(mockSwiftCodeModel.find).toHaveBeenCalledWith({ countryISO2: 'PL' });
    });
  });

  describe('createSwiftCode', () => {
    it('should create and save a swift code', async () => {
      const mockSwiftCodeDto = { swiftCode: 'ABC123', countryISO2: 'US' };
      mockSwiftCodeModel.create.mockResolvedValue(mockSwiftCodeDto);

      const result = await service.createSwiftCode(mockSwiftCodeDto as BranchSwiftCodeResponseDto);
      expect(result).toEqual(mockSwiftCodeDto);
    });
  });

  describe('deleteSwiftCode', () => {
    it('should delete a swift code and return the result', async () => {
      const mockDeleteResult = { deletedCount: 1 };
      mockSwiftCodeModel.deleteOne.mockResolvedValue(mockDeleteResult);

      const result = await service.deleteSwiftCode('ABC123');
      expect(result).toEqual(mockDeleteResult);
      expect(mockSwiftCodeModel.deleteOne).toHaveBeenCalledWith({ swiftCode: 'ABC123' });
    });
  });
});
