import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { BaseModel } from '../../../../database/base.model';
import { applySoftDelete } from '../../../../database/soft-delete.plugin';

export type TeamDocument = Team & Document;
export type TeamModel = SoftDeleteModel<TeamDocument>;

@Schema({ timestamps: true })
export class Team extends BaseModel {
  @Prop({ required: true, trim: true, index: true ,unique: true})
  name: string;

  @Prop({ required: false, trim: true,})
  description: string;
  
}

export const TeamSchema = SchemaFactory.createForClass(Team);

applySoftDelete(TeamSchema);

TeamSchema.index({ name: 1 });
