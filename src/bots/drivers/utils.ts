import type { Guild, Message } from 'discord.js'

const uidRegex = /<@(\d+)>/g;
function _extractUids(message: string): string[] {
  const matches = message.match(uidRegex)
  return matches
    ? matches.map(match => match.replace(/<@|>/g, ''))
    : []
}

async function createMappedUidUsername(messages: Message<true>[], usingNickname = false, guild?: Guild) {
  const userIdList = new Set(messages.map((m) => m.author.id));
  messages.forEach(m => _extractUids(m.content).forEach((uid) => userIdList.add(uid)));
  const mappedUidUsername = new Map<string, string>();
  await Promise.all([...userIdList].map(async (id) => {
    const guildUser = (usingNickname && guild) ? await guild.members.fetch({ user: id }) : null;
    const user = guildUser ? guildUser.user : messages.find(m => m.author.id === id)!.author;
    const nickname = guildUser?.nickname || '';
    const { globalName = '', displayName = '', username = '' } = user;
    mappedUidUsername.set(id, nickname || globalName || displayName || username);
  }))
  // guild.members.cache.clear()
  return mappedUidUsername;
}

function replaceMessagesUserPingToUsername(messages: Message<true>[], mappedUidUsername: Map<string, string>) {
  messages.forEach((message) => {
    _extractUids(message.content).forEach((uid) => {
      message.content = message.content.replace(new RegExp(`<@${uid}>`, 'g'), `@${mappedUidUsername.get(uid) || 'anonymous'}`);
    })
  });
  return messages;
}

export {
  createMappedUidUsername,
  replaceMessagesUserPingToUsername,
}
