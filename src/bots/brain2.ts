import { GUILD_ID, BRAIN2_TOKEN, BRAINS_CHANNEL_ID } from '../constants';
import ChannelTextBot from './drivers/ChannelTextBot';

const Brain2 = new ChannelTextBot({
  token: BRAIN2_TOKEN,
  guildId: GUILD_ID,
  channelId: BRAINS_CHANNEL_ID,
});

export default Brain2;
