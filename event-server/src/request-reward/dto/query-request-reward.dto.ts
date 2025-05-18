import { RequestRewardResult } from '../../schemas/request-reward.schema';

export class QueryRequestRewardDto {
  user?: string;
  eventId?: string;
  result?: RequestRewardResult;
  startDate?: Date;
  endDate?: Date;
}
