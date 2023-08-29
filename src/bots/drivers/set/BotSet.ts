import type BotDriver from '../BotDriver';

class BotSet<T extends BotDriver> extends Set<T> {
  constructor (bots: T[] = []) {
    super(bots);
  }

  get bots() {
    return [...this];
  }

  async connect() {
    await Promise.all([...this].map(b => b.connect()));
    return;
  }

  async disconnect() {
    await Promise.all([...this].map(b => b.disconnect()));
    return;
  }
}

export default BotSet
