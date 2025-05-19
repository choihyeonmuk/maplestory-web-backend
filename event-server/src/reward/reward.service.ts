import { Injectable } from '@nestjs/common';
import { RewardRepository } from './reward.repository';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { Reward } from '../schemas/reward.schema';

/**
 * 리워드 관련 비즈니스 로직을 처리하는 서비스
 * @class RewardService
 */
@Injectable()
export class RewardService {
  constructor(private readonly rewardRepository: RewardRepository) {}

  /**
   * 새로운 리워드를 생성합니다.
   * @param createRewardDto 생성할 리워드 정보
   * @returns 생성된 리워드 정보
   */
  async create(createRewardDto: CreateRewardDto): Promise<Reward> {
    return this.rewardRepository.create(createRewardDto);
  }

  /**
   * 모든 리워드 목록을 조회합니다.
   * @returns 리워드 목록
   */
  async findAll(): Promise<Reward[]> {
    return this.rewardRepository.findAll();
  }

  /**
   * 특정 이벤트에 속한 리워드 목록을 조회합니다.
   * @param eventId 이벤트 ID
   * @returns 해당 이벤트의 리워드 목록
   */
  async findByEventId(eventId: string): Promise<Reward[]> {
    return this.rewardRepository.findByEventId(eventId);
  }

  /**
   * ID로 단일 리워드를 조회합니다.
   * @param id 조회할 리워드 ID
   * @returns 조회된 리워드 정보
   */
  async findOne(id: string): Promise<Reward> {
    return this.rewardRepository.findOne(id);
  }

  /**
   * 리워드 정보를 업데이트합니다.
   * @param id 업데이트할 리워드 ID
   * @param updateRewardDto 업데이트할 리워드 정보
   * @returns 업데이트된 리워드 정보
   */
  async update(id: string, updateRewardDto: UpdateRewardDto): Promise<Reward> {
    return this.rewardRepository.update(id, updateRewardDto);
  }

  /**
   * 리워드를 삭제합니다.
   * @param id 삭제할 리워드 ID
   * @returns 삭제된 리워드 정보
   */
  async remove(id: string): Promise<Reward> {
    return this.rewardRepository.remove(id);
  }
}
