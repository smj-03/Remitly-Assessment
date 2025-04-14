import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SwiftCode, SwiftCodeSchema } from './swift-codes.schema';
import { SwiftCodesController } from './swift-codes.controller';
import { SwiftCodesService } from './swift-codes.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: SwiftCode.name, schema: SwiftCodeSchema }])],
  controllers: [SwiftCodesController],
  providers: [SwiftCodesService],
})
export class SwiftCodesModule {}
