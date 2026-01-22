import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { BaseModel } from '../../../../database/base.model';
import { applySoftDelete } from '../../../../database/soft-delete.plugin';

export type MatchDocument = Match & Document;
export type MatchModel = SoftDeleteModel<MatchDocument>;

@Schema({ timestamps: true })
export class Match extends BaseModel {
  @Prop({ 
    type: Types.ObjectId, 
    ref: 'Team', 
    required: true,
    index: true 
  })
  homeTeam: Types.ObjectId;

  @Prop({ 
    type: Types.ObjectId, 
    ref: 'Team', 
    required: true,
    index: true 
  })
  awayTeam: Types.ObjectId;

  @Prop({ required: true, trim: true })
  place: string;
}

export const MatchSchema = SchemaFactory.createForClass(Match);

applySoftDelete(MatchSchema);

MatchSchema.index({ homeTeam: 1, awayTeam: 1 });
MatchSchema.index({ place: 1 });
