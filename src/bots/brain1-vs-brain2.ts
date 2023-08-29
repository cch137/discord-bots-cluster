import { GUILD_ID, BRAIN1_TOKEN, BRAIN2_TOKEN, BRAINS_CHANNEL_ID } from '../constants';
import AiBotChatroom from './drivers/set/AiBotChatroom';
import ChannelTextBot from './drivers/ChannelTextBot';

const brainPrompt = (name: string) => `你是 ${name} 。請嘗試挑起一些涉及專業知識的話題，例如數學、物理、化學、生物、哲學、文化、資訊科技等。在回答時僅需專注於一個話題，請持續地讓對話充實。請在對話中省略敬語和致謝。請繼續對話。`

const Brain1 = new ChannelTextBot({
  token: BRAIN1_TOKEN,
  guildId: GUILD_ID,
  channelId: BRAINS_CHANNEL_ID,
  prompt: brainPrompt('Brain 1'),
});

const Brain2 = new ChannelTextBot({
  token: BRAIN2_TOKEN,
  guildId: GUILD_ID,
  channelId: BRAINS_CHANNEL_ID,
  prompt: brainPrompt('Brain 2'),
});

const Brain1VsBrain2 = new AiBotChatroom([Brain1, Brain2]);

export default Brain1VsBrain2;
