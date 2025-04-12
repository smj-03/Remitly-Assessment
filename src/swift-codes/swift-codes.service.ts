import { Injectable } from '@nestjs/common';
import { BranchSwiftCodeCreateDto } from './dto/branch-swift-code.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SwiftCode } from './swift-codes.schema';
import { Model } from 'mongoose';
import {
  IBranchSwiftCode,
  ICountrySwiftCodes,
  IHeadquarterSwiftCode,
} from './swift-codes.interface';

@Injectable()
export class SwiftCodesService {
  constructor(@InjectModel(SwiftCode.name) private swiftCodeModel: Model<SwiftCode>) {}

  public async getSwiftCodeByCode(
    swiftCode: string,
  ): Promise<IBranchSwiftCode | IHeadquarterSwiftCode | null> {
    const foundSwiftCode = await this.swiftCodeModel.findOne({ swiftCode });
    if (!foundSwiftCode) return null;
    if (!foundSwiftCode.isHeadquarter) return foundSwiftCode;
    return await this.getHeadquarterSwiftCode(foundSwiftCode);
  }

  public async getSwiftCodesByCountryCode(
    countryISO2code: string,
  ): Promise<ICountrySwiftCodes | null> {
    const foundSwiftCodes = await this.swiftCodeModel.find({ countryISO2: countryISO2code });
    if (foundSwiftCodes.length === 0) return null;

    const { countryName, countryISO2 } = foundSwiftCodes[0];
    return { countryName, countryISO2, swiftCodes: foundSwiftCodes };

    // const promises = foundSwiftCodes.map(
    //   async (swiftCode: SwiftCode): Promise<IBranchSwiftCode | IHeadquarterSwiftCode> => {
    //     if (!swiftCode.isHeadquarter) return swiftCode;
    //     return await this.getHeadquarterSwiftCode(swiftCode);
    //   },
    // );
    // const swiftCodes = await Promise.all(promises);
    // const { countryName, countryISO2 } = swiftCodes[0];
  }

  public async createSwiftCode(swiftCodeDto: BranchSwiftCodeCreateDto): Promise<IBranchSwiftCode> {
    const swiftCode = new this.swiftCodeModel(swiftCodeDto);
    return swiftCode.save();
  }

  private async getHeadquarterSwiftCode(swiftCode: SwiftCode): Promise<IHeadquarterSwiftCode> {
    const bankBranches = await this.getBankBranches(swiftCode.swiftCode);
    const hqSwiftCode = swiftCode.toObject<IHeadquarterSwiftCode>();
    hqSwiftCode.branches = bankBranches;
    return hqSwiftCode;
  }

  private async getBankBranches(swiftCode: string): Promise<IBranchSwiftCode[]> {
    const mainBankCode = swiftCode.slice(0, -3);
    return this.swiftCodeModel.find({
      isHeadquarter: false,
      swiftCode: { $regex: `^${mainBankCode}.{3}$` },
    });
  }
}
