import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RewardService } from './reward.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';

@Controller('rewards')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Post()
  async create(@Body() createRewardDto: CreateRewardDto) {
    return this.rewardService.create(createRewardDto);
  }

  @Get()
  async findAll(@Query('eventId') eventId?: string) {
    if (eventId) {
      return this.rewardService.findByEventId(eventId);
    }
    return this.rewardService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.rewardService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRewardDto: UpdateRewardDto) {
    return this.rewardService.update(id, updateRewardDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.rewardService.remove(id);
  }
}
