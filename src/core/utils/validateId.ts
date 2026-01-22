import { BadRequestException } from "@nestjs/common";
import { Types } from "mongoose";

export function validateAndConvertId(id: string): Types.ObjectId {
    const sanitizedId = id.trim();
    
    if (!Types.ObjectId.isValid(sanitizedId)) {
      throw new BadRequestException(`Invalid player ID format: "${id}"`);
    }
    
    return new Types.ObjectId(sanitizedId);
  }