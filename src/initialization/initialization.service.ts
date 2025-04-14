import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { SwiftParserService } from '../swift-parser/swift-parser.service';
import { InjectModel } from '@nestjs/mongoose';
import { SwiftCode } from '../swift-codes/swift-codes.schema';
import { Error, Model } from 'mongoose';
import { IBranchSwiftCode } from '../swift-codes/swift-codes.interface';

@Injectable()
export class InitializationService implements OnModuleInit {
  private readonly logger = new Logger(InitializationService.name);

  constructor(
    private swiftParserService: SwiftParserService,
    @InjectModel(SwiftCode.name) private swiftCodeModel: Model<SwiftCode>,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      const parsedSwiftCodes = this.swiftParserService.parseSwiftFromCsv(
        'src/downloads/Interns_2025_SWIFT_CODES.csv',
      );

      const swiftCodes: IBranchSwiftCode[] = parsedSwiftCodes.map((swiftCode) => {
        const isHeadquarter = swiftCode.swiftCode.slice(-3) === 'XXX';
        return { ...swiftCode, isHeadquarter };
      });

      await this.swiftCodeModel.deleteMany({});
      await this.swiftCodeModel.insertMany(swiftCodes);
    } catch (error) {
      const stack = error instanceof Error ? error.stack : 'Unknown error stack';
      this.logger.error('Failed to populate the database!', stack);
    }
  }
}
