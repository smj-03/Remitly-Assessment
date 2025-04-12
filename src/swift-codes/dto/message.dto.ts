import { Expose } from 'class-transformer';

@Expose()
export class MessageDto {
  @Expose()
  message: string;
}
