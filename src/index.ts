import 'reflect-metadata';
import 'dotenv/config';
import {
  ChannelType,
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  REST,
  RESTPostAPIApplicationCommandsJSONBody,
  Routes,
  SlashCommandBuilder,
} from 'discord.js';
import { handleChatInputCommand } from './handlers/chatInputCommand';
import { AppDataSource } from './typeorm';
import { handleButtonInteraction } from './handlers/buttonInteraction';

const CLIENT_ID = '999203924571607150';
const GUILD_ID = '997820362446340096';
const TOKEN = process.env.BOT_TOKEN!;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: '10' }).setToken(TOKEN);

const commands: RESTPostAPIApplicationCommandsJSONBody[] = [
  new SlashCommandBuilder()
    .setName('setup')
    .setDescription(
      'Initializes the Ticket Bot & Sends a Message to a Channel for Customers to Create Tickets'
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel to send the message to')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .toJSON(),
  new SlashCommandBuilder()
    .setName('roles')
    .setDescription('Manage roles for Ticket Bot')
    .setDefaultMemberPermissions('0')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription('Adds a Guild Role to the Ticket Configuration')
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('The role to add to the Ticket Config')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('Removes a Guild Role from the Ticket Configuration')
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('The role to remove from the Ticket Config')
            .setRequired(true)
        )
    )
    .toJSON(),
];

client.on('ready', () => console.log(`${client.user?.tag} logged in`));

client.on('interactionCreate', (interaction) => {
  if (interaction.isChatInputCommand())
    client.emit('chatInputCommand', client, interaction);
  else if (interaction.isButton())
    client.emit('buttonInteraction', client, interaction);
});

client.on('chatInputCommand', handleChatInputCommand);
client.on('buttonInteraction', handleButtonInteraction);

async function main() {
  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });
    await AppDataSource.initialize();
    client.login(TOKEN);
  } catch (err) {
    console.log(err);
  }
}

main();
