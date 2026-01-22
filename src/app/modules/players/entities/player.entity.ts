
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { BaseModel } from '../../../../database/base.model';
import { applySoftDelete } from '../../../../database/soft-delete.plugin';

export type PlayerDocument = Player & Document;
export type PlayerModel = SoftDeleteModel<PlayerDocument>;

@Schema({ timestamps: true })
export class Player extends BaseModel {
  @Prop({ required: true, trim: true, index: true })
  name: string;

  @Prop({ required: true, min: 1, max: 99 })
  number: number;

  @Prop({ required: true, min: 16, max: 50 })
  age: number;
  @Prop({ required: true, trim: true, unique: true, index: true })
  email: string;

}

export const PlayerSchema = SchemaFactory.createForClass(Player);

applySoftDelete(PlayerSchema);
PlayerSchema.index({ name: 1 });
