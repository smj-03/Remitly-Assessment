import { Injectable } from '@nestjs/common';
import { BranchSwiftCodeCreateDto } from './dto/branch-swift-code.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SwiftCode } from './swift-codes.schema';
import { Model } from 'mongoose';

@Injectable()
export class SwiftCodesService {
  constructor(
    @InjectModel(SwiftCode.name) private swiftCodeModel: Model<SwiftCode>,
  ) {}

  public async createSwiftCode(
    swiftCodeDto: BranchSwiftCodeCreateDto,
  ): Promise<SwiftCode> {
    const swiftCode = new this.swiftCodeModel(swiftCodeDto);
    return swiftCode.save();
  }
}
