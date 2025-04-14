import { Module } from '@nestjs/common';
import { SwiftParserService } from './swift-parser.service';

@Module({
  providers: [SwiftParserService],
  exports: [SwiftParserService],
})
export class SwiftParserModule {}
