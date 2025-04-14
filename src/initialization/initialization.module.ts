import { Module } from '@nestjs/common';
import { SwiftParserModule } from '../swift-parser/swift-parser.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SwiftCode, SwiftCodeSchema } from '../swift-codes/swift-codes.schema';
import { SwiftParserService } from '../swift-parser/swift-parser.service';
import { InitializationService } from './initialization.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SwiftCode.name, schema: SwiftCodeSchema }]),
    SwiftParserModule,
  ],
  providers: [InitializationService, SwiftParserService],
  exports: [InitializationService],
})
export class InitializationModule {}
