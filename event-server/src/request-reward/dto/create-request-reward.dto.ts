// Import for Swagger decorators
import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestRewardDto {
  @ApiProperty({
    description: '유저 ID',
    example: '64a12345b789c12345d67890',
  })
  user: string;

  @ApiProperty({
    description: '이벤트 ID',
    example: '64a98765b789c12345d67890',
  })
  eventId: string;
}
