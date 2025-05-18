import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { RequestRewardService } from './request-reward.service';
import { CreateRequestRewardDto } from './dto/create-request-reward.dto';
import { QueryRequestRewardDto } from './dto/query-request-reward.dto';

@Controller('request-rewards')
export class RequestRewardController {
  constructor(private readonly requestRewardService: RequestRewardService) {}

  @Post()
  async requestReward(@Body() createRequestRewardDto: CreateRequestRewardDto) {
    return this.requestRewardService.requestReward(createRequestRewardDto);
  }

  @Get()
  async findAll(@Query() queryDto: QueryRequestRewardDto) {
    return this.requestRewardService.findAll(queryDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.requestRewardService.findOne(id);
  }
}
