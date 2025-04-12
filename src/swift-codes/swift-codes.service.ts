import { Injectable } from '@nestjs/common';
import { BranchSwiftCodeDto } from './dto/branch-swift-code.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SwiftCode } from './swift-codes.schema';
import { Model } from 'mongoose';

@Injectable()
export class SwiftCodesService {
  constructor(
    @InjectModel(SwiftCode.name) private swiftCodeModel: Model<SwiftCode>,
  ) {}

  public async addSwiftCode(swiftCodeDto: BranchSwiftCodeDto) {
    const createdSwiftCode = new this.swiftCodeModel(swiftCodeDto);
    return createdSwiftCode.save();
  }
}
