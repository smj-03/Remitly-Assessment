import { Test, TestingModule } from '@nestjs/testing';
import { SwiftParserService } from './swift-parser.service';

describe('SwiftParserService', () => {
  let service: SwiftParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SwiftParserService],
    }).compile();

    service = module.get<SwiftParserService>(SwiftParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
