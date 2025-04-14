import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InitializationModule } from './initialization/initialization.module';
import { SwiftParserModule } from './swift-parser/swift-parser.module';
import { SwiftCodesModule } from './swift-codes/swift-codes.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017'),
    InitializationModule,
    SwiftParserModule,
    SwiftCodesModule,
  ],
})
export class AppModule {}
