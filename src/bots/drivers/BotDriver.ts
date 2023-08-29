import { Client, IntentsBitField } from 'discord.js'
import logDate from '../../utils/log-date';

class BotDriver {
  #token: string;
  client: Client;
  loggedInAt?: number;

  constructor (token: string) {
    this.#token = token;
    this.client = new Client({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
      ]
    });
  }

  get displayName() {
    return this.client.user?.displayName
  }

  get globalName() {
    return this.client.user?.globalName
  }

  get username() {
    return this.client.user?.username
  }

  get name() {
    return this.username
  }

  get id () {
    return this.client.user!.id
  }

  async connect() {
    await this.client.login(this.#token);
    this.loggedInAt = Date.now()
    logDate(`${this.name} Logged in at`, this.loggedInAt);
  }

  async disconnect() {
    await this.client.destroy();
    logDate(`${this.name} Logged out at`, Date.now());
  }
}

export default BotDriver;
