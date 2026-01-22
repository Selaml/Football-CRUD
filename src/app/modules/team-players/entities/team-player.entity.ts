import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { BaseModel } from '../../../../database/base.model';
import { applySoftDelete } from '../../../../database/soft-delete.plugin';

export type TeamPlayerDocument = TeamPlayer & Document;
export type TeamPlayerModel = SoftDeleteModel<TeamPlayerDocument>;

@Schema({ timestamps: true })
export class TeamPlayer extends BaseModel {
  @Prop({ 
    type: Types.ObjectId, 
    ref: 'Team', 
    required: true,
    index: true 
  })
  teamId: Types.ObjectId;

  @Prop({ 
    type: Types.ObjectId, 
    ref: 'Player', 
    required: true,
    index: true 
  })
  playerId: Types.ObjectId;
}

export const TeamPlayerSchema = SchemaFactory.createForClass(TeamPlayer);

applySoftDelete(TeamPlayerSchema);


TeamPlayerSchema.index({ teamId: 1, playerId: 1 }, { unique: true });


TeamPlayerSchema.index({ teamId: 1 });

TeamPlayerSchema.index({ playerId: 1 });
