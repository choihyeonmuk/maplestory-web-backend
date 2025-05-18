import { RewardType } from '../../schemas/reward.schema';

export class UpdateRewardDto {
  type?: RewardType;
  targetId?: string;
  quantity?: number;
  eventId?: string;
}
