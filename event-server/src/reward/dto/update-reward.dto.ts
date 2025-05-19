import { RewardType } from '../../schemas/reward.schema';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRewardDto {
  @ApiProperty({
    description: '보상 타입',
    enum: RewardType,
    example: RewardType.ITEM,
    required: false,
  })
  type?: RewardType;

  @ApiProperty({
    description: '보상 항목 ID (아이템 ID 또는 우편함 ID 등)',
    example: '5000123',
    required: false,
  })
  targetId?: string;

  @ApiProperty({
    description: '보상 지급 수량',
    example: 1,
    required: false,
  })
  quantity?: number;

  @ApiProperty({
    description: '이벤트 ID',
    example: '64a12345b789c12345d67890',
    required: false,
  })
  eventId?: string;
}
