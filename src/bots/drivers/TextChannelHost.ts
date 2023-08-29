import type { Guild, TextChannel } from 'discord.js';
import { EmbedBuilder } from 'discord.js'
import { v4 as generateUUID } from 'uuid';
import splitTextToChunks from '../../utils/split-text-to-chunks';
import logDate from '../../utils/log-date';
import { askWithCurva, dcMessagesToContext, countTokensLength } from '../../utils/gpt';
import BotDriver from './BotDriver';

interface TextChannelHostCreateOptions {
  token: string;
  guildId: string;
  channelId: string;
  prompt: string;
}

class TextChannelHost extends BotDriver {
  get name() {
    return this.username
  }

  guildId: string;
  channelId: string;
  prompt: string;
  // @ts-ignore
  guild: Guild;
  // @ts-ignore
  channel: TextChannel;

  constructor (options: TextChannelHostCreateOptions) {
    const { token, guildId, channelId, prompt } = options;
    super(token)
    this.guildId = guildId;
    this.channelId = channelId;
    this.prompt = prompt;
  }
  
  async getRecentChannelMessages() {
    return await BotDriver.prototype.getRecentChannelMessages.call(this, this.guild, this.channel)
  }

  async init() {
    await this.connect();
    const [guild, channel] = await Promise.all([
      this.client.guilds.fetch(this.guildId),
      this.client.channels.fetch(this.channelId)
    ]);
    if (guild === null) throw 'Guild not found';
    if (channel === null) throw 'Channel not found';
    if (channel.type !== 0) throw 'Channel is not a TextBasedChannel';
    this.guild = guild;
    this.channel = channel;
    this.client.on('messageCreate', async (message) => {
      if (message.author.id === this.id) return;
      if (message.channelId !== this.channelId) return;
      console.log(`${this.name} Received a message.`);
      const typingId = this.startTyping();
      const t0 = Date.now()
      const messages = await this.getRecentChannelMessages()
      console.log(`${this.name} Fetched ${messages.length} messages in ${Date.now() - t0}ms`)
      const t1 = Date.now()
      const context = dcMessagesToContext(messages, this.id, 4800 - countTokensLength(this.prompt))
      console.log(`${this.name} Prepare in ${Date.now() - t1}ms`)
      try {
        const t0 = Date.now()
        const responses = splitTextToChunks(await askWithCurva('gpt4_t03_5k', `${this.prompt}\n\n${context}`, ''), 1800)
        this.endTyping(typingId)
        for (const response of responses) {
          await this.channel.send(response)
        }
        console.log(`${this.name} Reply in ${Date.now() - t0}ms`)
      } catch (err) {
        this.endTyping(typingId)
        console.log(`${this.name} Error when reply: ${err}`)
        this.channel.send({ embeds: [new EmbedBuilder({ description: `Oops! Something went wrong. ${err}` }).setColor('Red')] })
      }
    })
  }

  #typingThreads = new Set<string>();
  #typingInterval?: NodeJS.Timeout
  #isTyping = false;

  startTyping() {
    const uuid = generateUUID();
    this.#typingThreads.add(uuid);
    if (!this.#isTyping) {
      this.#isTyping = true;
      this.channel!.sendTyping();
      this.#typingInterval = setInterval(() => this.channel!.sendTyping(), 5000);
    }
    return uuid;
  }

  endTyping(uuid: string) {
    this.#typingThreads.delete(uuid);
    if (this.#typingThreads.size === 0) {
      clearInterval(this.#typingInterval);
      this.#isTyping = false;
    }
  }
}

export type {
  TextChannelHostCreateOptions
}

export default TextChannelHost
