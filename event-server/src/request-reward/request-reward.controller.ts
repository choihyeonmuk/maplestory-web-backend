import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { RequestRewardService } from './request-reward.service';
import { CreateRequestRewardDto } from './dto/create-request-reward.dto';
import { QueryRequestRewardDto } from './dto/query-request-reward.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('request-rewards')
@Controller('request-rewards')
export class RequestRewardController {
  constructor(private readonly requestRewardService: RequestRewardService) {}

  @Post()
  @ApiOperation({
    summary: '이벤트 보상 요청',
    description: '사용자가 이벤트 보상을 요청합니다.',
  })
  @ApiBody({ type: CreateRequestRewardDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '보상 요청이 성공적으로 생성되었습니다.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '잘못된 요청 데이터 또는 이미 처리된 요청',
  })
  async requestReward(@Body() createRequestRewardDto: CreateRequestRewardDto) {
    return this.requestRewardService.requestReward(createRequestRewardDto);
  }

  @Get()
  @ApiOperation({
    summary: '보상 요청 목록 조회',
    description: '모든 보상 요청 목록을 조회합니다. 필터링이 가능합니다.',
  })
  @ApiQuery({
    name: 'userId',
    description: '사용자 ID 필터',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'eventId',
    description: '이벤트 ID 필터',
    required: false,
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '보상 요청 목록 조회 성공',
  })
  async findAll(@Query() queryDto: QueryRequestRewardDto) {
    return this.requestRewardService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: '특정 보상 요청 조회',
    description: 'ID로 특정 보상 요청을 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '보상 요청 ID',
    example: '64a12345b789c12345d67890',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '보상 요청 조회 성공',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '보상 요청을 찾을 수 없음',
  })
  async findOne(@Param('id') id: string) {
    return this.requestRewardService.findOne(id);
  }
}
