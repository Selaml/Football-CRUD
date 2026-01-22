import { Schema } from 'mongoose';
const mongooseDelete = require('mongoose-delete');



export function applySoftDelete(schema: Schema) {
  schema.plugin(mongooseDelete, {
    deletedAt: true, 
    deletedBy: false,
    overrideMethods: 'all', 
    indexFields: ['deletedAt'], 
  });

 
  schema.index({ deletedAt: 1 });
}
