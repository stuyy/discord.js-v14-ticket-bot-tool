import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CacheType,
  ChatInputCommandInteraction,
  Client,
  GuildTextBasedChannel,
} from 'discord.js';
import { AppDataSource } from '../typeorm';
import { TicketConfig } from '../typeorm/entities/TicketConfig';

const ticketConfigRepository = AppDataSource.getRepository(TicketConfig);

export async function handleChatInputCommand(
  client: Client,
  interaction: ChatInputCommandInteraction<CacheType>
) {
  console.log('HandleChatInputCommand');
  switch (interaction.commandName) {
    case 'setup': {
      const guildId = interaction.guildId || '';
      const channel = interaction.options.getChannel(
        'channel'
      ) as GuildTextBasedChannel;
      const ticketConfig = await ticketConfigRepository.findOneBy({ guildId });
      const messageOptions = {
        content:
          'Interact with the Buttons to either Create or Manage a ticket',
        components: [
          new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder()
              .setCustomId('createTicket')
              .setEmoji('🎫')
              .setLabel('Create Ticket')
              .setStyle(ButtonStyle.Primary)
          ),
        ],
      };
      try {
        if (!ticketConfig) {
          const msg = await channel.send(messageOptions);
          const newTicketConfig = ticketConfigRepository.create({
            guildId,
            messageId: msg.id,
            channelId: channel.id,
          });
          await ticketConfigRepository.save(newTicketConfig);
          console.log('Saved new Configuration to Database');
          await interaction.reply({
            content: `Ticket Bot Initialized!`,
            ephemeral: true,
          });
        } else {
          console.log('Ticket Config exists... Updating Values');
          const msg = await channel.send(messageOptions);
          ticketConfig.channelId = channel.id;
          ticketConfig.messageId = msg.id;
          await ticketConfigRepository.save(ticketConfig);
          await interaction.reply({
            content: `New message sent in ${channel}. Updated Database Record.`,
            ephemeral: true,
          });
        }
      } catch (err) {
        console.log(err);
        await interaction.reply({
          content: `Something went wrong...`,
          ephemeral: true,
        });
      }
    }
  }
}
