import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { ISwiftCode } from '../swift-codes/swift-codes.interface';

@Schema()
export class SwiftCode implements ISwiftCode {
  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  bankName: string;

  @Prop({ type: String, uppercase: true, required: true })
  countryISO2: string;

  @Prop({ required: true })
  isHeadquarter: boolean;

  @Prop({ required: true })
  swiftCode: string;

  @Prop({ type: String, uppercase: true, required: true })
  countryName: string;
}

export type SwiftCodeDocument = HydratedDocument<SwiftCode>;

export const SwiftCodeSchema = SchemaFactory.createForClass(SwiftCode);
