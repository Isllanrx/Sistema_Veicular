import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Contract extends Document {
  @Prop({ required: true })
  transactionId: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  fileSize: number;

  @Prop({ required: true })
  fileHash: string;

  @Prop({ type: Buffer, required: true })
  fileBuffer: Buffer;

  @Prop({ required: true })
  uploadDate: Date;
}

export const ContractSchema = SchemaFactory.createForClass(Contract); 