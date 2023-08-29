import logText from '../../utils/log-text';
import type { ChannelTextBotCreateOptions } from './ChannelTextBot';
import ChannelTextBot from './ChannelTextBot';

class AutomatedReplyChannelTextBot extends ChannelTextBot {
  constructor (options: ChannelTextBotCreateOptions) {
    super(options);
  }

  async init() {
    await ChannelTextBot.prototype.init.call(this);
    this.client.on('messageCreate', async (message) => {
      if (message.author.id === this.id) return;
      if (message.channelId !== this.channelId) return;
      logText(`${this.name} Received a message.`);
      this.respondInChannelAsCurva();
    })
  }
}

export default AutomatedReplyChannelTextBot
