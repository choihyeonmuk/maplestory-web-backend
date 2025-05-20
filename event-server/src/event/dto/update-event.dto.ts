import { EventStatus, EventProvideBy } from '../../schemas/event.schema';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEventDto {
  @ApiProperty({
    description: '이벤트 이름',
    example: '메이플 18주년 이벤트',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: '이벤트 설명',
    example: '메이플스토리 18주년을 맞이하여 다양한 이벤트를 진행합니다.',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: '이벤트 시작 날짜',
    example: '2024-04-01T00:00:00.000Z',
    required: false,
  })
  startDate?: Date;

  @ApiProperty({
    description: '이벤트 종료 날짜',
    example: '2024-04-30T23:59:59.000Z',
    required: false,
  })
  endDate?: Date;

  @ApiProperty({
    description: '이벤트 상태',
    enum: EventStatus,
    example: EventStatus.ACTIVE,
    required: false,
  })
  status?: EventStatus;

  @ApiProperty({
    description: '이벤트 지급 방식 (수동/시스템)',
    enum: EventProvideBy,
    example: EventProvideBy.MANUAL,
    required: false,
  })
  provideBy?: EventProvideBy;

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
