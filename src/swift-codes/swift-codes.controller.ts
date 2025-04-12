import { Body, Controller, Post } from '@nestjs/common';
import {
  BranchSwiftCodeCreateDto,
  BranchSwiftCodeResponseDto,
} from './dto/branch-swift-code.dto';
import { SwiftCodesService } from './swift-codes.service';
import { plainToInstance } from 'class-transformer';

@Controller('swift-codes')
export class SwiftCodesController {
  constructor(private readonly swiftCodesService: SwiftCodesService) {}

  @Post()
  async addSwiftCode(
    @Body() swiftCodeDto: BranchSwiftCodeCreateDto,
  ): Promise<BranchSwiftCodeResponseDto> {
    const swiftCode =
      await this.swiftCodesService.createSwiftCode(swiftCodeDto);
    return plainToInstance(BranchSwiftCodeResponseDto, swiftCode);
  }
}
