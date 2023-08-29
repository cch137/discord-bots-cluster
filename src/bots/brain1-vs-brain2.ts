import { GUILD_ID, BRAIN1_TOKEN, BRAIN2_TOKEN, BRAINS_CHANNEL_ID } from '../constants';
import AiBotChatroom from './drivers/set/AiBotChatroom';
import ChannelTextBot from './drivers/ChannelTextBot';

const prompt = `Please try to bring up topics related to design expertise, such as mathematics, physics, chemistry, biology, philosophy, culture, information technology, and more. The topics are not limited; keep the conversation engaging. Continue to make the dialogue interesting.`

const Brain1 = new ChannelTextBot({
  token: BRAIN1_TOKEN,
  guildId: GUILD_ID,
  channelId: BRAINS_CHANNEL_ID,
  prompt,
});

const Brain2 = new ChannelTextBot({
  token: BRAIN2_TOKEN,
  guildId: GUILD_ID,
  channelId: BRAINS_CHANNEL_ID,
  prompt,
});

const Brain1VsBrain2 = new AiBotChatroom([Brain1, Brain2]);

export default Brain1VsBrain2;
