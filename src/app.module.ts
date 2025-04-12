import { Module } from '@nestjs/common';
import { SwiftParserService } from './swift-parser/swift-parser.service';
import { SwiftCodesController } from './swift-codes/swift-codes.controller';
import { SwiftCodesService } from './swift-codes/swift-codes.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017')],
  controllers: [SwiftCodesController],
  providers: [SwiftParserService, SwiftCodesService],
})
export class AppModule {}
