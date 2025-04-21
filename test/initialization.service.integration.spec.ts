import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { InitializationModule } from '../src/initialization/initialization.module';
import { SwiftCode } from '../src/swift-codes/swift-codes.schema';
import { Model } from 'mongoose';

jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});

describe('SwiftCodesController Integration', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let swiftCodeModel: Model<SwiftCode>;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: () => ({
            uri,
          }),
        }),
        InitializationModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
          exposeUnsetFields: false,
        },
      }),
    );
    app.setGlobalPrefix('v1');
    await app.init();

    swiftCodeModel = app.get(getModelToken(SwiftCode.name));
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });

  it('Initialization service should populate the database', async () => {
    const swiftCodes = await swiftCodeModel.find().exec();
    expect(swiftCodes.length).toEqual(1061);
  });
});
