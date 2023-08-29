import { GUILD_ID, BOT_TOKEN2, CHANNEL_ID2 } from '../constants';
import AutomatedReplyChannelTextBot from './drivers/AutomatedReplyChannelTextBot';
import languageTeacher from './prompts/language-teacher';

const KobayashiNatsumi = new AutomatedReplyChannelTextBot({
  token: BOT_TOKEN2,
  guildId: GUILD_ID,
  channelId: CHANNEL_ID2,
  prompt: languageTeacher('小林 なつみ', '日文')
});

export default KobayashiNatsumi;
