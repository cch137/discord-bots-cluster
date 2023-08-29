import { GUILD_ID, BRAIN1_TOKEN, BRAINS_CHANNEL_ID } from '../constants';
import ChannelTextBot from './drivers/ChannelTextBot';

const Brain1 = new ChannelTextBot({
  token: BRAIN1_TOKEN,
  guildId: GUILD_ID,
  channelId: BRAINS_CHANNEL_ID,
});

export default Brain1;
