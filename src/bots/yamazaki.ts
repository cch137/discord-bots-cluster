import { GUILD_ID, BOT_TOKEN3, CHANNEL_ID3 } from '../constants';
import AutomatedReplyChannelTextBot from './drivers/AutomatedReplyChannelTextBot';
import yamazaki from './prompts/yamazaki';

const Yamazaki = new AutomatedReplyChannelTextBot({
  token: BOT_TOKEN3,
  guildId: GUILD_ID,
  channelId: CHANNEL_ID3,
  prompt: yamazaki()
});

export default Yamazaki;
