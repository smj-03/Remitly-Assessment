import { Module } from '@nestjs/common';
import { SwiftParserService } from './swift-parser/swift-parser.service';
import { SwiftCodesController } from './swift-codes/swift-codes.controller';
import { SwiftCodesService } from './swift-codes/swift-codes.service';

@Module({
  imports: [],
  controllers: [SwiftCodesController],
  providers: [SwiftParserService, SwiftCodesService],
})
export class AppModule {}
