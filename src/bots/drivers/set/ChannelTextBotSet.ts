import TextBotSet from './TextBotSet';
import type ChannelTextBot from '../ChannelTextBot';

class ChannelTextBotSet<T extends ChannelTextBot> extends TextBotSet<T> {
  constructor (bots: T[] = []) {
    super(bots);
  }

  async init() {
    await TextBotSet.prototype.init.call(this);
    return;
  }
}

export default ChannelTextBotSet
