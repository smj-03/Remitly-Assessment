import { Test, TestingModule } from '@nestjs/testing';
import {
  ClassSerializerInterceptor,
  INestApplication,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';

import { SwiftCodesModule } from '../src/swift-codes/swift-codes.module';
import {
  BranchSwiftCodeCreateDto,
  BranchSwiftCodeResponseDto,
} from '../src/swift-codes/dto/branch-swift-code.dto';
import { MessageResponseDto } from '../src/swift-codes/dto/message.dto';
import { HeadquarterSwiftCodeResponseDto } from '../src/swift-codes/dto/headquarter-swift-code.dto';
import { CountrySwiftCodesResponseDto } from '../src/swift-codes/dto/country-swift-codes.dto';
import { Reflector } from '@nestjs/core';
import { useContainer } from 'class-validator';

jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});

describe('SwiftCodesController Integration', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;

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
        SwiftCodesModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    useContainer(app.select(SwiftCodesModule), { fallbackOnErrors: true });

    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector), {
        strategy: 'excludeAll',
        excludeExtraneousValues: true,
      }),
    );
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
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });

  it('should create a new branch swift code', async () => {
    const payload: BranchSwiftCodeCreateDto = {
      address: '123 Test St',
      bankName: 'Test Bank',
      countryISO2: 'US',
      countryName: 'United States',
      isHeadquarter: false,
      swiftCode: 'ABCDUS12XYZ',
    };

    const response = await request(app.getHttpServer())
      .post('/v1/swift-codes')
      .send(payload)
      .expect(201);

    const expectedResponse: MessageResponseDto = {
      message: `Successfully added SWIFT code ${payload.swiftCode}.`,
    };

    expect(response.body).toEqual(expectedResponse);
  });

  it('should create a new headquarter swift code', async () => {
    const payload: BranchSwiftCodeCreateDto = {
      address: 'ABC Test St',
      bankName: 'Test Bank',
      countryISO2: 'US',
      countryName: 'United States',
      isHeadquarter: true,
      swiftCode: 'ABCDUS12XXX',
    };

    const response = await request(app.getHttpServer())
      .post('/v1/swift-codes')
      .send(payload)
      .expect(201);

    const expectedResponse: MessageResponseDto = {
      message: `Successfully added SWIFT code ${payload.swiftCode}.`,
    };

    expect(response.body).toEqual(expectedResponse);
  });

  it('should fail to create a new branch swift code if it already exists', async () => {
    const payload: BranchSwiftCodeCreateDto = {
      address: '123 Test St',
      bankName: 'Test Bank',
      countryISO2: 'US',
      countryName: 'United States',
      isHeadquarter: false,
      swiftCode: 'ABCDUS12XYZ',
    };

    const response = await request(app.getHttpServer())
      .post('/v1/swift-codes')
      .send(payload)
      .expect(400);

    const expectedResponse = {
      error: 'Bad Request',
      message: ['SWIFT code ABCDUS12XYZ already exists'],
      statusCode: 400,
    };

    expect(response.body).toEqual(expectedResponse);
  });

  it('should fail to create a new branch swift code when values are missing', async () => {
    const payload: Partial<BranchSwiftCodeCreateDto> = {};

    const response = await request(app.getHttpServer())
      .post('/v1/swift-codes')
      .send(payload)
      .expect(400);

    const expectedResponse = {
      error: 'Bad Request',
      message: [
        'address must be a string',
        'bankName should not be empty',
        'bankName must be a string',
        'countryISO2 must be a valid ISO31661 Alpha2 code',
        'countryName should not be empty',
        'countryName must be a string',
        'isHeadquarter must be a boolean value',
        'swiftCode must be a BIC or SWIFT code',
      ],
      statusCode: 400,
    };

    expect(response.body).toEqual(expectedResponse);
  });

  it('should retrieve a branch swift code', async () => {
    const swiftCode = 'ABCDUS12XYZ';

    const response = await request(app.getHttpServer())
      .get(`/v1/swift-codes/${swiftCode}`)
      .expect(200);

    const expectedResponse: BranchSwiftCodeResponseDto = {
      address: '123 Test St',
      bankName: 'Test Bank',
      countryISO2: 'US',
      countryName: 'UNITED STATES',
      isHeadquarter: false,
      swiftCode,
    };

    expect(response.body).toEqual(expectedResponse);
  });

  it('should retrieve a headquarter swift code', async () => {
    const swiftCode = 'ABCDUS12XXX';

    const response = await request(app.getHttpServer())
      .get(`/v1/swift-codes/${swiftCode}`)
      .expect(200);

    const expectedResponse: HeadquarterSwiftCodeResponseDto = {
      address: 'ABC Test St',
      bankName: 'Test Bank',
      countryISO2: 'US',
      countryName: 'UNITED STATES',
      isHeadquarter: true,
      swiftCode,
      branches: [
        {
          address: '123 Test St',
          bankName: 'Test Bank',
          countryISO2: 'US',
          isHeadquarter: false,
          swiftCode: 'ABCDUS12XYZ',
        },
      ],
    };

    expect(response.body).toEqual(expectedResponse);
  });

  it('should retrieve swift codes by countryISO2', async () => {
    const countryISO2 = 'US';

    const response = await request(app.getHttpServer())
      .get(`/v1/swift-codes/country/${countryISO2}`)
      .expect(200);

    const expectedResponse: CountrySwiftCodesResponseDto = {
      countryISO2,
      countryName: 'UNITED STATES',
      swiftCodes: [
        {
          address: '123 Test St',
          bankName: 'Test Bank',
          countryISO2,
          isHeadquarter: false,
          swiftCode: 'ABCDUS12XYZ',
        },
        {
          address: 'ABC Test St',
          bankName: 'Test Bank',
          countryISO2,
          isHeadquarter: true,
          swiftCode: 'ABCDUS12XXX',
        },
      ],
    };

    expect(response.body).toEqual(expectedResponse);
  });

  it('should fail to retrieve swift codes by countryISO2 if not found', async () => {
    const countryISO2 = 'DE';

    const response = await request(app.getHttpServer())
      .get(`/v1/swift-codes/country/${countryISO2}`)
      .expect(404);

    const expectedResponse = {
      error: 'Not Found',
      message: `SWIFT codes with ${countryISO2} code not found.`,
      statusCode: 404,
    };

    expect(response.body).toEqual(expectedResponse);
  });

  it('should fail to retrieve when a swift code is not found', async () => {
    const swiftCode = 'XYZ123ABC';

    const response = await request(app.getHttpServer())
      .get(`/v1/swift-codes/${swiftCode}`)
      .expect(404);

    const expectedResponse = {
      error: 'Not Found',
      message: `SWIFT code ${swiftCode} not found.`,
      statusCode: 404,
    };

    expect(response.body).toEqual(expectedResponse);
  });

  it('should delete a swift code', async () => {
    const swiftCode = 'ABCDUS12XYZ';

    const response = await request(app.getHttpServer())
      .delete(`/v1/swift-codes/${swiftCode}`)
      .expect(200);

    const expectedResponse: MessageResponseDto = {
      message: `Successfully deleted SWIFT code ${swiftCode}.`,
    };

    expect(response.body).toEqual(expectedResponse);
  });

  it('should fail to delete when a swift code is not found', async () => {
    const swiftCode = 'XYZ123ABC';

    const response = await request(app.getHttpServer())
      .delete(`/v1/swift-codes/${swiftCode}`)
      .expect(404);

    const expectedResponse = {
      error: 'Not Found',
      message: `SWIFT code ${swiftCode} not found.`,
      statusCode: 404,
    };

    expect(response.body).toEqual(expectedResponse);
  });
});
