import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiOperation({
    summary: '이벤트 생성',
    description: '새로운 이벤트를 생성합니다.',
  })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '이벤트가 성공적으로 생성되었습니다.',
    type: CreateEventDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '잘못된 요청 데이터',
  })
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  @ApiOperation({
    summary: '모든 이벤트 조회',
    description: '등록된 모든 이벤트 목록을 조회합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '이벤트 목록 조회 성공',
    type: [CreateEventDto],
  })
  async findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: '특정 이벤트 조회',
    description: 'ID로 특정 이벤트를 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '이벤트 ID',
    example: '64a12345b789c12345d67890',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '이벤트 조회 성공',
    type: CreateEventDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이벤트를 찾을 수 없음',
  })
  async findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '이벤트 수정',
    description: '특정 이벤트의 정보를 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '이벤트 ID',
    example: '64a12345b789c12345d67890',
  })
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '이벤트 수정 성공',
    type: CreateEventDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이벤트를 찾을 수 없음',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '잘못된 요청 데이터',
  })
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '이벤트 삭제',
    description: '특정 이벤트를 삭제합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '이벤트 ID',
    example: '64a12345b789c12345d67890',
  })
  @ApiResponse({ status: HttpStatus.OK, description: '이벤트 삭제 성공' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이벤트를 찾을 수 없음',
  })
  async remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }
}
