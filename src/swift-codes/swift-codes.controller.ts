import { Body, Controller, Post } from '@nestjs/common';
import { BranchSwiftCodeDto } from './dto/branch-swift-code.dto';
import { SwiftCodesService } from './swift-codes.service';

@Controller('swift-codes')
export class SwiftCodesController {
  constructor(private readonly swiftCodesService: SwiftCodesService) {}

  @Post()
  async addSwiftCode(@Body() swiftCodeDto: BranchSwiftCodeDto) {
    return this.swiftCodesService.addSwiftCode(swiftCodeDto);
  }
}
