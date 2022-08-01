import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
