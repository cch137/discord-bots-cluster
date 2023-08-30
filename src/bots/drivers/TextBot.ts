import type { TextChannel } from 'discord.js';
import { EmbedBuilder } from 'discord.js'
import { v4 as generateUUID } from 'uuid';
import BotDriver from './BotDriver';
import { createMappedUidUsername, replaceMessagesUserPingToUsername } from './utils';
import { askWithCurva, dcMessagesToContext, countTokensLength } from '../../utils/gpt';
import logText from '../../utils/log-text';
import splitTextToChunks from '../../utils/split-text-to-chunks';
import type { DCMessage } from '../../types';

const _getTyping = (() => {
  class _TextChannelTypingManager extends Set<string> {
    #channel: TextChannel;
    #typingInterval?: NodeJS.Timeout;
  
    constructor(channel: TextChannel) {
      super()
      this.#channel = channel;
    }
  
    startTyping() {
      const uuid = generateUUID();
      if (this.size === 0) {
        this.#channel.sendTyping();
        this.#typingInterval = setInterval(() => this.#channel.sendTyping(), 5000);
        _typings.set(this.#channel, this);
      }
      this.add(uuid);
      return uuid;
    }
  
    endTyping(uuid: string) {
      this.delete(uuid);
      if (this.size === 0) {
        clearInterval(this.#typingInterval);
        _typings.delete(this.#channel);
      }
    }
  }
  const _typings = new Map<TextChannel, _TextChannelTypingManager>();
  return function (channel: TextChannel) {
    return _typings.get(channel) || new _TextChannelTypingManager(channel);
  }
})();

class TextBot extends BotDriver {
  constructor (token: string) {
    super(token)
  }

  async init() {
    await this.connect();
  }

  async respondInChannelAsCurva(channel: TextChannel, prompt = '', temperature_string='t03') {
    const typingId = this.startTyping(channel);
    const messages = await this.getRecentChannelMessages(channel);
    const t0 = Date.now();
    const context = dcMessagesToContext(messages, this.id, 4800 - countTokensLength(prompt));
    logText(`${this.name} Prepare in ${Date.now() - t0}ms`);
    try {
      const t0 = Date.now()
      const answer = await askWithCurva(`gpt4_${temperature_string}_5k`, `${prompt}\n\n${context}`, '')
      this.endTyping(channel, typingId)
      this.sendTextMessageInChunks(channel, answer)
      logText(`${this.name} Reply in ${Date.now() - t0}ms`)
    } catch (err) {
      this.endTyping(channel, typingId)
      logText(`${this.name} Error when reply: ${err}`)
      channel.send({ embeds: [new EmbedBuilder({ description: `Oops! Something went wrong. ${err}` }).setColor('Red')] })
    }
  }

  async sendTextMessageInChunks(channel: TextChannel, content: string) {
    const chunks = splitTextToChunks(content, 1800)
    for (const chunk of chunks) {
      await channel.send(chunk)
    }
    return;
  }

  async getRecentChannelMessages(channel: TextChannel, limit?: number, replaceWithUsername = true): Promise<DCMessage[]> {
    const t0 = Date.now()
    const messages = (await channel.messages.fetch({ limit })).map(m => m)
    channel.messages.cache.clear()
    if (replaceWithUsername) {
      const mappedUidUsername = await createMappedUidUsername(messages)
      logText(`${this.name} Fetched ${messages.length} messages in ${Date.now() - t0}ms`)
      return replaceMessagesUserPingToUsername(messages, mappedUidUsername)
        .map((message) => ({
          createdAt: message.createdTimestamp,
          uid: message.author.id,
          user: mappedUidUsername.get(message.author.id) || 'anonymous',
          content: message.content.trim()
        }))
        .filter((m) => m.content)
        .reverse()
    }
    logText(`${this.name} Fetched ${messages.length} messages in ${Date.now() - t0}ms`)
    return messages
      .map((message) => ({
        createdAt: message.createdTimestamp,
        uid: message.author.id,
        user: message.author.globalName || message.author.displayName || message.author.username,
        content: message.content.trim()
      }))
        .filter((m) => m.content)
        .reverse()
  }

  startTyping(channel: TextChannel) {
    return _getTyping(channel).startTyping();
  }

  endTyping(channel: TextChannel, uuid: string) {
    return _getTyping(channel).endTyping(uuid);
  }
}

export default TextBot
