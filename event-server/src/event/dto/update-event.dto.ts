import { EventStatus } from '../../schemas/event.schema';

export class UpdateEventDto {
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status?: EventStatus;
  conditions?: Record<string, any>;
}
