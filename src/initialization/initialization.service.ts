import { Injectable, OnModuleInit } from '@nestjs/common';
import { SwiftParserService } from '../swift-parser/swift-parser.service';
import { InjectModel } from '@nestjs/mongoose';
import { SwiftCode } from '../swift-codes/swift-codes.schema';
import { Model } from 'mongoose';
import { IBranchSwiftCode } from '../swift-codes/swift-codes.interface';

@Injectable()
export class InitializationService implements OnModuleInit {
  constructor(
    private swiftParserService: SwiftParserService,
    @InjectModel(SwiftCode.name) private swiftCodeModel: Model<SwiftCode>,
  ) {}

  async onModuleInit(): Promise<void> {
    const parsedSwiftCodes = this.swiftParserService.parseSwiftFromCsv(
      'src/downloads/Interns_2025_SWIFT_CODES.csv',
    );

    const swiftCodes: IBranchSwiftCode[] = parsedSwiftCodes.map((swiftCode) => {
      const isHeadquarter = swiftCode.swiftCode.slice(-3) === 'XXX';
      return { ...swiftCode, isHeadquarter };
    });

    await this.swiftCodeModel.deleteMany({});
    await this.swiftCodeModel.insertMany(swiftCodes);
  }
}
