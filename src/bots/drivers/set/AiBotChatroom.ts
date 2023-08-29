import ChannelTextBotSet from './ChannelTextBotSet';
import type ChannelTextBot from '../ChannelTextBot';

class AiBotChatroom extends ChannelTextBotSet<ChannelTextBot> {
  #lastRespondStartedAt = 0;
  #isResponding = false;
  cooldownMs: number;

  constructor (bots: ChannelTextBot[] = [], cooldownMs = 15 * 60 * 1000) {
    super(bots);
    this.cooldownMs = cooldownMs;
  }

  async init() {
    await ChannelTextBotSet.prototype.init.call(this);
    await this.run();
  }

  async run() {
    if (this.#isResponding) return;
    this.#isResponding = true;
    const nextBot = await this.getNextBot();
    this.#lastRespondStartedAt = Date.now();
    nextBot.respondInChannelAsCurva()
      .then(() => {
        this.#isResponding = false;
        if (this.#lastRespondStartedAt + this.cooldownMs < Date.now()) {
          setTimeout(() => this.run(), 0);
        } else {
          const nextRunAt = this.#lastRespondStartedAt + this.cooldownMs;
          setTimeout(() => this.run(), nextRunAt - Date.now());
        }
      })
  }

  async getNextBot() {
    const lastMessageUid = (await this.bots[0].getRecentChannelMessages(1))[0]?.uid;
    return this.bots.find(b => b.id !== lastMessageUid) as ChannelTextBot;
  }
}

export default AiBotChatroom
