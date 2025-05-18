import { RequestRewardResult } from '../../schemas/request-reward.schema';

export class CreateRequestRewardDto {
  user: string;
  eventId: string;
}
