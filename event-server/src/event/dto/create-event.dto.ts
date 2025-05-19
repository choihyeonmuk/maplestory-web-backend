import { EventStatus } from '../../schemas/event.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ description: '이벤트 이름', example: '메이플 17주년 이벤트' })
  name: string;

  @ApiProperty({
    description: '이벤트 설명',
    example: '메이플스토리 17주년을 맞이하여 다양한 이벤트를 진행합니다.',
  })
  description: string;

  @ApiProperty({
    description: '이벤트 시작 날짜',
    example: '2023-04-01T00:00:00.000Z',
  })
  startDate: Date;

  @ApiProperty({
    description: '이벤트 종료 날짜',
    example: '2023-04-30T23:59:59.000Z',
  })
  endDate: Date;

  @ApiProperty({
    description: '이벤트 상태',
    enum: EventStatus,
    example: EventStatus.ACTIVE,
  })
  status: EventStatus;

  @ApiProperty({
    description: '이벤트 참여 조건',
    required: false,
    example: {
      minLevel: 30,
      maxLevel: 200,
      requiredItems: ['4000000', '4000001'],
    },
  })
  conditions?: Record<string, any>;
}
