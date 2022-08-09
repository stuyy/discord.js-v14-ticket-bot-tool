import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TicketConfigRole } from './TicketConfigRole';

@Entity({ name: 'ticket_configs' })
export class TicketConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  guildId: string;

  @Column()
  messageId: string;

  @Column()
  channelId: string;

  @OneToMany(() => TicketConfigRole, (role) => role.ticketConfig)
  roles: TicketConfigRole[];
}
