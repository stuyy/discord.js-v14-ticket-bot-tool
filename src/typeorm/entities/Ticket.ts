import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TicketStatus } from '../../utils/types';

@Entity({ name: 'tickets' })
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  channelId: string;

  @Column({ nullable: true })
  messageId: string;

  @Column()
  createdBy: string;

  @Column({ default: 'created' })
  status: TicketStatus;
}
