import type { Guild, TextChannel } from 'discord.js';
import { Client, IntentsBitField } from 'discord.js'
import logDate from '../../utils/log-date';
import { createMappedUidUsername, replaceMessagesUserPingToUsername } from './utils';

class BotDriver {
  #token: string;
  client: Client;
  loggedInAt?: number;

  constructor (token: string) {
    this.#token = token;
    this.client = new Client({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
      ]
    });
  }

  get displayName() {
    return this.client.user?.displayName
  }

  get globalName() {
    return this.client.user?.globalName
  }

  get username() {
    return this.client.user?.username
  }

  get id () {
    return this.client.user!.id
  }

  async connect() {
    await this.client.login(this.#token);
    this.loggedInAt = Date.now()
    logDate(`${this.username} Logged in at`, this.loggedInAt);
  }

  async disconnect() {
    await this.client.destroy();
    logDate(`${this.username} Logged out at`, Date.now());
  }

  async getRecentChannelMessages(guild: Guild, channel: TextChannel, replaceWithUsername = true) {
    const messages = (await channel.messages.fetch()).map(m => m)
    channel.messages.cache.clear()
    if (!replaceWithUsername) {
      return messages
        .map((message) => ({
          createdAt: message.createdTimestamp,
          uid: message.author.id,
          user: message.author.globalName || message.author.displayName || message.author.username,
          content: message.content
        }))
          .filter((m) => m.content.trim())
          .reverse()
    }
    const mappedUidUsername = await createMappedUidUsername(guild, messages)
    return replaceMessagesUserPingToUsername(messages, mappedUidUsername)
      .map((message) => ({
        createdAt: message.createdTimestamp,
        uid: message.author.id,
        user: mappedUidUsername.get(message.author.id) || 'anonymous',
        content: message.content
      }))
      .filter((m) => m.content.trim())
      .reverse()
  }
}

export default BotDriver;
