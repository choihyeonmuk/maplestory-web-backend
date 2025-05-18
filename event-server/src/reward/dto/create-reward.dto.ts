import { RewardType } from '../../schemas/reward.schema';

export class CreateRewardDto {
  type: RewardType;
  targetId: string;
  quantity: number;
  eventId: string;
}
