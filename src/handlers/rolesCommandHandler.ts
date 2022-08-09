import { CacheType, ChatInputCommandInteraction, Client } from 'discord.js';
import { AppDataSource } from '../typeorm';
import { TicketConfig } from '../typeorm/entities/TicketConfig';
import { TicketConfigRole } from '../typeorm/entities/TicketConfigRole';

const ticketConfigRepository = AppDataSource.getRepository(TicketConfig);
const ticketConfigRoleRepository =
  AppDataSource.getRepository(TicketConfigRole);

export async function handleRolesCommand(
  client: Client,
  interaction: ChatInputCommandInteraction<CacheType>
) {
  const subcommand = interaction.options.getSubcommand();
  const guildId = interaction.guildId || '';
  console.log('Handle Roles Command');
  console.log(`Subcommand: ${subcommand}`);
  const ticketConfig = await ticketConfigRepository.findOneBy({ guildId });
  if (!ticketConfig) {
    await interaction.reply({
      content: 'You do not have a ticket config setup. Use the /setup command.',
      ephemeral: true,
    });
    return;
  }
  switch (subcommand) {
    case 'add':
      await handleRolesAddSubcommand(client, interaction, ticketConfig);
      break;

    case 'remove':
      await handleRolesRemoveSubcommand(client, interaction, ticketConfig);
      break;
  }
}

export async function handleRolesRemoveSubcommand(
  client: Client,
  interaction: ChatInputCommandInteraction<CacheType>,
  ticketConfig: TicketConfig
) {
  try {
    const role = interaction.options.getRole('role', true);
    const ticketConfigRole = await ticketConfigRoleRepository.findOneBy({
      roleId: role.id,
      ticketConfig,
    });
    if (!ticketConfigRole) {
      await interaction.reply({
        content: 'Role did not exist',
        ephemeral: true,
      });
      return;
    }
    await ticketConfigRoleRepository.delete(ticketConfigRole);
    await interaction.reply({
      content: 'Deleted role successfully!',
      ephemeral: true,
    });
  } catch (err) {
    console.log(err);
    await interaction.reply({
      content: 'Something went wrong',
      ephemeral: true,
    });
  }
}

export async function handleRolesAddSubcommand(
  client: Client,
  interaction: ChatInputCommandInteraction<CacheType>,
  ticketConfig: TicketConfig
) {
  const role = interaction.options.getRole('role', true);
  try {
    const ticketConfigRole = await ticketConfigRoleRepository.findOneBy({
      roleId: role.id,
      ticketConfig,
    });
    if (ticketConfigRole) {
      await interaction.reply({
        content: 'That role already is added',
        ephemeral: true,
      });
      return;
    }

    const newRole = ticketConfigRoleRepository.create({
      roleId: role.id,
      ticketConfig,
    });

    const savedRoled = await ticketConfigRoleRepository.save(newRole);
    console.log('Saved Role to DB');
    await interaction.reply({
      content: 'Role added successfully!',
      ephemeral: true,
    });
  } catch (err) {
    console.log(err);
    await interaction.reply({
      content: 'Something went wrong',
      ephemeral: true,
    });
  }
}
