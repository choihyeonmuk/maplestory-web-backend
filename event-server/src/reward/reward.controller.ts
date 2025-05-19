import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { RewardService } from './reward.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('rewards')
@Controller('rewards')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Post()
  @ApiOperation({
    summary: '보상 생성',
    description: '새로운 보상을 생성합니다.',
  })
  @ApiBody({ type: CreateRewardDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '보상이 성공적으로 생성되었습니다.',
    type: CreateRewardDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '잘못된 요청 데이터',
  })
  async create(@Body() createRewardDto: CreateRewardDto) {
    return this.rewardService.create(createRewardDto);
  }

  @Get()
  @ApiOperation({
    summary: '보상 목록 조회',
    description:
      '등록된 모든 보상 목록을 조회하거나 특정 이벤트의 보상만 필터링하여 조회합니다.',
  })
  @ApiQuery({
    name: 'eventId',
    description: '특정 이벤트 ID로 보상 필터링',
    required: false,
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '보상 목록 조회 성공',
    type: [CreateRewardDto],
  })
  async findAll(@Query('eventId') eventId?: string) {
    if (eventId) {
      return this.rewardService.findByEventId(eventId);
    }
    return this.rewardService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: '특정 보상 조회',
    description: 'ID로 특정 보상을 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '보상 ID',
    example: '64a12345b789c12345d67890',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '보상 조회 성공',
    type: CreateRewardDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '보상을 찾을 수 없음',
  })
  async findOne(@Param('id') id: string) {
    return this.rewardService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '보상 수정',
    description: '특정 보상의 정보를 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '보상 ID',
    example: '64a12345b789c12345d67890',
  })
  @ApiBody({ type: UpdateRewardDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '보상 수정 성공',
    type: CreateRewardDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '보상을 찾을 수 없음',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '잘못된 요청 데이터',
  })
  async update(
    @Param('id') id: string,
    @Body() updateRewardDto: UpdateRewardDto,
  ) {
    return this.rewardService.update(id, updateRewardDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '보상 삭제',
    description: '특정 보상을 삭제합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '보상 ID',
    example: '64a12345b789c12345d67890',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '보상 삭제 성공',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '보상을 찾을 수 없음',
  })
  async remove(@Param('id') id: string) {
    return this.rewardService.remove(id);
  }
}
