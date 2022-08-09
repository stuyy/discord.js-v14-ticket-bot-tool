import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TicketConfig } from './TicketConfig';

@Entity({ name: 'ticket_config_roles' })
export class TicketConfigRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roleId: string;

  @ManyToOne(() => TicketConfig, (config) => config.roles)
  ticketConfig: TicketConfig;
}
