import { GUILD_ID, BOT_TOKEN1, CHANNEL_ID1 } from '../constants';
import AutomatedReplyChannelTextBot from './drivers/AutomatedReplyChannelTextBot';
import languageTeacher from './prompts/language-teacher';

const MrMatthew = new AutomatedReplyChannelTextBot({
  token: BOT_TOKEN1,
  guildId: GUILD_ID,
  channelId: CHANNEL_ID1,
  prompt: languageTeacher('Mr. Matthew', 'English')
});

export default MrMatthew;
