import { Injectable } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from '../schemas/event.schema';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    return this.eventRepository.create(createEventDto);
  }

  async findAll(): Promise<Event[]> {
    return this.eventRepository.findAll();
  }

  async findOne(id: string): Promise<Event> {
    return this.eventRepository.findOne(id);
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    return this.eventRepository.update(id, updateEventDto);
  }

  async remove(id: string): Promise<Event> {
    return this.eventRepository.remove(id);
  }
}
