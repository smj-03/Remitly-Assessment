import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { IBranchSwiftCode } from '../swift-codes/swift-codes.interface';

@Schema()
export class SwiftCode extends Document implements IBranchSwiftCode {
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

export const SwiftCodeSchema = SchemaFactory.createForClass(SwiftCode);
