import { Injectable } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from '../schemas/event.schema';

/**
 * 이벤트 관련 비즈니스 로직을 처리하는 서비스
 * @class EventService
 */
@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  /**
   * 새로운 이벤트를 생성합니다.
   * @param createEventDto 생성할 이벤트 정보
   * @returns 생성된 이벤트 정보
   */
  async create(createEventDto: CreateEventDto): Promise<Event> {
    return this.eventRepository.create(createEventDto);
  }

  /**
   * 모든 이벤트 목록을 조회합니다.
   * @returns 이벤트 목록
   */
  async findAll(): Promise<Event[]> {
    return this.eventRepository.findAll();
  }

  /**
   * ID로 단일 이벤트를 조회합니다.
   * @param id 조회할 이벤트 ID
   * @returns 조회된 이벤트 정보
   */
  async findOne(id: string): Promise<Event> {
    return this.eventRepository.findOne(id);
  }

  /**
   * 이벤트 정보를 업데이트합니다.
   * @param id 업데이트할 이벤트 ID
   * @param updateEventDto 업데이트할 이벤트 정보
   * @returns 업데이트된 이벤트 정보
   */
  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    return this.eventRepository.update(id, updateEventDto);
  }

  /**
   * 이벤트를 삭제합니다.
   * @param id 삭제할 이벤트 ID
   * @returns 삭제된 이벤트 정보
   */
  async remove(id: string): Promise<Event> {
    return this.eventRepository.remove(id);
  }
}
