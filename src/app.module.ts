import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InitializationModule } from './initialization/initialization.module';
import { SwiftParserModule } from './swift-parser/swift-parser.module';
import { SwiftCodesModule } from './swift-codes/swift-codes.module';

import 'dotenv/config';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/swift_codes_db'),
    InitializationModule,
    SwiftParserModule,
    SwiftCodesModule,
  ],
})
export class AppModule {}
