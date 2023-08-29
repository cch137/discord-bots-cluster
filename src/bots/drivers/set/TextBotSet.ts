import BotSet from './BotSet';
import type TextBot from '../TextBot';

class TextBotSet<T extends TextBot> extends BotSet<T> {
  constructor (bots: T[] = []) {
    super(bots);
  }

  async init() {
    await Promise.all(this.bots.map(b => b.init()));
    return;
  }
}

export default TextBotSet
