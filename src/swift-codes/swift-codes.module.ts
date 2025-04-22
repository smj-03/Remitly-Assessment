import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SwiftCode, SwiftCodeSchema } from './swift-codes.schema';
import { SwiftCodesController } from './swift-codes.controller';
import { SwiftCodesService } from './swift-codes.service';
import { IsUniqueSwiftCodeConstraint } from './validators/is-unique-swift-code.constraint';

@Module({
  imports: [MongooseModule.forFeature([{ name: SwiftCode.name, schema: SwiftCodeSchema }])],
  controllers: [SwiftCodesController],
  providers: [SwiftCodesService, IsUniqueSwiftCodeConstraint],
})
export class SwiftCodesModule {}
