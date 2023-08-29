import KobayashiNatsumi from "./kobayashi-natsumi";
import MrMatthew from "./mr-matthew";

const bots = {
  KobayashiNatsumi,
  MrMatthew,
  initAll () {
    return Promise.all([
      KobayashiNatsumi.init(),
      MrMatthew.init(),
    ])
  },
  connectAll () {
    return Promise.all([
      KobayashiNatsumi.connect(),
      MrMatthew.connect(),
    ])
  },
  disconnectAll () {
    return Promise.all([
      KobayashiNatsumi.disconnect(),
      MrMatthew.disconnect(),
    ])
  },
}

export default bots;