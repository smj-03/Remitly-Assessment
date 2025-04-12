import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SwiftCodesModule } from './swift-codes/swift-codes.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017'),
    SwiftCodesModule,
  ],
})
export class AppModule {}
