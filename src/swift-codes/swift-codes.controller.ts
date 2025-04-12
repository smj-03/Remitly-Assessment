import { Body, Controller, Delete, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { BranchSwiftCodeCreateDto, BranchSwiftCodeResponseDto } from './dto/branch-swift-code.dto';
import { SwiftCodesService } from './swift-codes.service';
import { plainToInstance } from 'class-transformer';
import { HeadquarterSwiftCodeResponseDto } from './dto/headquarter-swift-code.dto';
import { CountrySwiftCodesDto } from './dto/country-swift-codes.dto';
import { MessageDto } from './dto/message.dto';

@Controller('swift-codes')
export class SwiftCodesController {
  constructor(private readonly swiftCodesService: SwiftCodesService) {}

  @Get(':swiftCode')
  async findOne(
    @Param('swiftCode') swiftCode: string,
  ): Promise<BranchSwiftCodeResponseDto | HeadquarterSwiftCodeResponseDto> {
    const foundSwiftCode = await this.swiftCodesService.getSwiftCodeByCode(swiftCode);
    if (!foundSwiftCode) throw new NotFoundException(`Swift code ${swiftCode} not found.`);
    if (!foundSwiftCode.isHeadquarter)
      return plainToInstance(BranchSwiftCodeResponseDto, foundSwiftCode);
    return plainToInstance(HeadquarterSwiftCodeResponseDto, foundSwiftCode);
  }

  @Get('country/:countryISO2code')
  async findAll(@Param('countryISO2code') countryISO2code: string) {
    const foundSwiftCodes =
      await this.swiftCodesService.getSwiftCodesByCountryCode(countryISO2code);
    if (!foundSwiftCodes)
      throw new NotFoundException(`Swift codes with ${countryISO2code} code not found.`);
    return plainToInstance(CountrySwiftCodesDto, foundSwiftCodes);
  }

  @Post()
  async add(@Body() swiftCodeDto: BranchSwiftCodeCreateDto): Promise<MessageDto> {
    await this.swiftCodesService.createSwiftCode(swiftCodeDto);
    return plainToInstance(MessageDto, {
      message: `Successfully added swift code ${swiftCodeDto.swiftCode}.`,
    });
  }

  @Delete(':swiftCode')
  async delete(@Param('swiftCode') swiftCode: string) {
    const deleteResult = await this.swiftCodesService.deleteSwiftCode(swiftCode);
    if (deleteResult.deletedCount === 0)
      throw new NotFoundException(`Swift code ${swiftCode} not found.`);
    return plainToInstance(MessageDto, {
      message: `Successfully deleted swift code ${swiftCode}.`,
    });
  }
}
