import { Test, TestingModule } from '@nestjs/testing';
import { SwiftCodesController } from './swift-codes.controller';
import { SwiftCodesService } from './swift-codes.service';
import { NotFoundException } from '@nestjs/common';
import { BranchSwiftCodeCreateDto } from './dto/branch-swift-code.dto';
import { CountrySwiftCodesResponseDto } from './dto/country-swift-codes.dto';
import { plainToInstance } from 'class-transformer';

const mockSwiftCodesService = {
  getSwiftCodeByCode: jest.fn(),
  getSwiftCodesByCountryCode: jest.fn(),
  createSwiftCode: jest.fn(),
  deleteSwiftCode: jest.fn(),
};

describe('SwiftCodesController', () => {
  let controller: SwiftCodesController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SwiftCodesController],
      providers: [
        {
          provide: SwiftCodesService,
          useValue: mockSwiftCodesService,
        },
      ],
    }).compile();

    controller = module.get<SwiftCodesController>(SwiftCodesController);
  });

  describe('findOne', () => {
    it('should return a swift code', async () => {
      const mockSwiftCode = {
        swiftCode: 'ABC123',
        countryISO2: 'US',
        isHeadquarter: false,
      };
      mockSwiftCodesService.getSwiftCodeByCode.mockResolvedValue(mockSwiftCode);

      const result = await controller.findOneByCode('ABC123');

      expect(result).toEqual(mockSwiftCode);
      expect(mockSwiftCodesService.getSwiftCodeByCode).toHaveBeenCalledWith('ABC123');
    });

    it('should throw NotFoundException when a swift code is not found', async () => {
      mockSwiftCodesService.getSwiftCodeByCode.mockResolvedValue(null);

      await expect(controller.findOneByCode('ABC123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return country swift codes', async () => {
      const mockSwiftCodes = [
        { swiftCode: 'ABC123', countryISO2: 'US', isHeadquarter: false },
        { swiftCode: 'DEF456', countryISO2: 'US', isHeadquarter: true },
      ];
      const countrySwiftCodes = {
        countryISO2: 'US',
        countryName: 'USA',
        swiftCodes: mockSwiftCodes,
      };
      mockSwiftCodesService.getSwiftCodesByCountryCode.mockResolvedValue(countrySwiftCodes);

      const result = await controller.findAllByCountry('US');
      const expectedResult = plainToInstance(CountrySwiftCodesResponseDto, result);

      expect(result).toEqual(expectedResult);
      expect(mockSwiftCodesService.getSwiftCodesByCountryCode).toHaveBeenCalledWith('US');
    });

    it('should throw NotFoundException when no swift codes are found', async () => {
      mockSwiftCodesService.getSwiftCodesByCountryCode.mockResolvedValue(null);

      await expect(controller.findAllByCountry('XX')).rejects.toThrow(NotFoundException);
    });
  });

  describe('add', () => {
    it('should create a swift code and return a success message', async () => {
      const dto = {
        swiftCode: 'ABC123',
        countryISO2: 'US',
      };
      mockSwiftCodesService.createSwiftCode.mockResolvedValue(undefined);

      const result = await controller.add(dto as BranchSwiftCodeCreateDto);

      expect(result).toEqual({ message: 'Successfully added SWIFT code ABC123.' });
      expect(mockSwiftCodesService.createSwiftCode).toHaveBeenCalledWith(dto);
    });
  });

  describe('delete', () => {
    it('should delete a swift code and return a success message', async () => {
      mockSwiftCodesService.deleteSwiftCode.mockResolvedValue({ deletedCount: 1 });

      const result = await controller.delete('ABC123');

      expect(result).toEqual({
        message: 'Successfully deleted SWIFT code ABC123.',
      });
      expect(mockSwiftCodesService.deleteSwiftCode).toHaveBeenCalledWith('ABC123');
    });

    it('should throw NotFoundException when a swift code is not found', async () => {
      mockSwiftCodesService.deleteSwiftCode.mockResolvedValue({ deletedCount: 0 });

      await expect(controller.delete('ABC123')).rejects.toThrow(NotFoundException);
    });
  });
});
