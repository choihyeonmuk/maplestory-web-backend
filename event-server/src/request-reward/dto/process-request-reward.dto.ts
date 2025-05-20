import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RequestRewardResult } from '../../schemas/request-reward.schema';

export class ProcessRequestRewardDto {
  @ApiProperty({
    description: '처리할 보상 요청 ID',
    example: '64a12345b789c12345d67890',
  })
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @ApiProperty({
    description: '처리 결과',
    enum: RequestRewardResult,
    example: RequestRewardResult.SUCCESS,
  })
  @IsEnum(RequestRewardResult)
  @IsNotEmpty()
  result: RequestRewardResult;

  @ApiProperty({
    description: '처리에 대한 메시지 (선택 사항)',
    example: '이벤트 참여 조건 충족으로 보상 지급 승인',
    required: false,
  })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({
    description: '보상 처리 여부 (true인 경우 보상 처리 진행)',
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  processRewards?: boolean;
}
