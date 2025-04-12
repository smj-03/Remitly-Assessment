import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import {
  BranchSwiftCodeCreateDto,
  BranchSwiftCodeResponseDto,
} from './dto/branch-swift-code.dto';
import { SwiftCodesService } from './swift-codes.service';
import { plainToInstance } from 'class-transformer';
import { HeadquarterSwiftCodeResponseDto } from './dto/headquarter-swift-code.dto';

@Controller('swift-codes')
export class SwiftCodesController {
  constructor(private readonly swiftCodesService: SwiftCodesService) {}

  @Get(':swiftCode')
  async findOne(
    @Param('swiftCode') swiftCode: string,
  ): Promise<BranchSwiftCodeResponseDto | HeadquarterSwiftCodeResponseDto> {
    const foundSwiftCode = await this.swiftCodesService.getSwiftCode(swiftCode);
    if (!foundSwiftCode)
      throw new NotFoundException(`Swift code ${swiftCode} not found.`);
    if (!foundSwiftCode.isHeadquarter)
      return plainToInstance(BranchSwiftCodeResponseDto, foundSwiftCode);
    return plainToInstance(HeadquarterSwiftCodeResponseDto, foundSwiftCode);
  }

  @Post()
  async add(
    @Body() swiftCodeDto: BranchSwiftCodeCreateDto,
  ): Promise<BranchSwiftCodeResponseDto> {
    const createdSwiftCode =
      await this.swiftCodesService.createSwiftCode(swiftCodeDto);
    return plainToInstance(BranchSwiftCodeResponseDto, createdSwiftCode);
  }
}
