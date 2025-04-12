import { Injectable } from '@nestjs/common';
import { BranchSwiftCodeCreateDto } from './dto/branch-swift-code.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SwiftCode } from './swift-codes.schema';
import { Model } from 'mongoose';
import {
  IBaseSwiftCode,
  IBranchSwiftCode,
  IHeadquarterSwiftCode,
} from './swift-codes.interface';

@Injectable()
export class SwiftCodesService {
  constructor(
    @InjectModel(SwiftCode.name) private swiftCodeModel: Model<SwiftCode>,
  ) {}

  public async getSwiftCode(
    swiftCode: string,
  ): Promise<IBranchSwiftCode | IHeadquarterSwiftCode | null> {
    const foundSwiftCode = await this.swiftCodeModel.findOne({ swiftCode });
    if (!foundSwiftCode) return null;
    if (!foundSwiftCode.isHeadquarter) return foundSwiftCode;
    const bankBranches = await this.getBankBranches(swiftCode);
    const hqSwiftCode = foundSwiftCode.toObject<IHeadquarterSwiftCode>();
    hqSwiftCode.branches = bankBranches;
    return hqSwiftCode;
  }

  public async createSwiftCode(
    swiftCodeDto: BranchSwiftCodeCreateDto,
  ): Promise<IBranchSwiftCode> {
    const swiftCode = new this.swiftCodeModel(swiftCodeDto);
    return swiftCode.save();
  }

  private async getBankBranches(
    swiftCode: string,
  ): Promise<IBranchSwiftCode[]> {
    const mainBankCode = swiftCode.slice(0, -3);
    return this.swiftCodeModel.find({
      isHeadquarter: false,
      swiftCode: { $regex: `^${mainBankCode}.{3}$` },
    });
  }
}
