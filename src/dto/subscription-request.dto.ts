import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class SubscriptionRequestDto {
  @IsNotEmpty()
  @IsString()
  instrument: string;

  @IsNotEmpty()
  @IsObject()
  preferences: Record<string, any>;
}
