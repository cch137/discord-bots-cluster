import type { Guild, TextChannel } from 'discord.js';
import TextBot from './TextBot';

interface ChannelTextBotCreateOptions {
  token: string;
  guildId: string;
  channelId: string;
  prompt?: string;
}

class ChannelTextBot extends TextBot {
  guildId: string;
  channelId: string;
  prompt: string;
  // @ts-ignore
  guild: Guild;
  // @ts-ignore
  channel: TextChannel;

  constructor (options: ChannelTextBotCreateOptions) {
    const { token, guildId, channelId, prompt = '' } = options;
    super(token)
    this.guildId = guildId;
    this.channelId = channelId;
    this.prompt = prompt;
  }

  async init() {
    await TextBot.prototype.init.call(this);
    const [guild, channel] = await Promise.all([
      this.client.guilds.fetch(this.guildId),
      this.client.channels.fetch(this.channelId)
    ]);
    if (guild === null) throw 'Guild not found';
    if (channel === null) throw 'Channel not found';
    if (channel.type !== 0) throw 'Channel is not a TextBasedChannel';
    this.guild = guild;
    this.channel = channel;
  }

  respondInChannelAsCurva() {
    return TextBot.prototype.respondInChannelAsCurva.call(this, this.channel, this.prompt);
  }

  sendTextMessageInChunks(content: string): Promise<void>;
  sendTextMessageInChunks(channel: TextChannel, content: string): Promise<void>;
  sendTextMessageInChunks(arg1: string | TextChannel, arg2?: string) {
    if (typeof arg1 === 'string') {
      return TextBot.prototype.sendTextMessageInChunks.call(this, this.channel, arg1);
    } else {
      return TextBot.prototype.sendTextMessageInChunks.call(this, arg1, arg2 || '');
    }
  }

  getRecentChannelMessages() {
    return TextBot.prototype.getRecentChannelMessages.call(this, this.channel);
  }

  startTyping() {
    return TextBot.prototype.startTyping.call(this, this.channel);
  }

  endTyping(uuid: string): void;
  endTyping(channel: TextChannel, uuid: string): void;
  endTyping(arg1: string | TextChannel, arg2?: string) {
    if (typeof arg1 === 'string') {
      return TextBot.prototype.endTyping.call(this, this.channel, arg1);
    } else {
      return TextBot.prototype.endTyping.call(this, arg1, arg2 || '');
    }
  }
}

export type {
  ChannelTextBotCreateOptions
}

export default ChannelTextBot
