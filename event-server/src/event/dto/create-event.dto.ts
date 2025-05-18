import { EventStatus } from '../../schemas/event.schema';

export class CreateEventDto {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: EventStatus;
  conditions?: Record<string, any>;
}
