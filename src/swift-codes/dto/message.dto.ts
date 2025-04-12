import { Expose } from 'class-transformer';

@Expose()
export class MessageResponseDto {
  @Expose()
  message: string;
}
