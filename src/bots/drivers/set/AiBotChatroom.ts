import ChannelTextBotSet from './ChannelTextBotSet';
import type ChannelTextBot from '../ChannelTextBot';

class AiBotChatroom extends ChannelTextBotSet<ChannelTextBot> {
  #lastResondedAt = 0;
  #isResponding = false;
  cooldownMs: number;

  constructor (bots: ChannelTextBot[] = [], cooldownMs = 15 * 60 * 1000) {
    super(bots);
    this.cooldownMs = cooldownMs;
  }

  async init() {
    await ChannelTextBotSet.prototype.init.call(this);
    this.run();
  }

  async run() {
    if (this.#isResponding) return;
    this.#isResponding = true;
    const nextBot = await this.getNextBot();
    nextBot.respondInChannelAsCurva()
      .then(() => {
        this.#isResponding = false;
        const now = Date.now();
        if (this.#lastResondedAt + this.cooldownMs < now) {
          setTimeout(() => this.run(), 0);
        } else {
          const nextRunAt = this.#lastResondedAt + this.cooldownMs;
          setTimeout(() => this.run(), nextRunAt - now);
        }
        this.#lastResondedAt = now;
      })
  }

  async getNextBot() {
    const lastMessageUid = (await this.bots[0].getRecentChannelMessages(1))[0]?.uid;
    return this.bots.find(b => b.id !== lastMessageUid) as ChannelTextBot;
  }
}

export default AiBotChatroom
