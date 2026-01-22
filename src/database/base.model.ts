import { Prop, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export abstract class BaseModel extends Document {
  declare _id: Types.ObjectId;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  createdBy?: string;

  @Prop()
  updatedBy?: string;

  @Prop({ type: Date })
  deletedAt?: Date;

  @Prop()
  deletedBy?: string;
}
