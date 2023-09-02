import KobayashiNatsumi from "./kobayashi-natsumi";
import MrMatthew from "./mr-matthew";
import Brain1VsBrain2 from "./brain1-vs-brain2";

const bots = {
  KobayashiNatsumi,
  MrMatthew,
  Brain1VsBrain2,
  initAll () {
    return Promise.all([
      KobayashiNatsumi.init(),
      MrMatthew.init(),
      // Brain1VsBrain2.init(),
    ])
  },
  connectAll () {
    return Promise.all([
      KobayashiNatsumi.connect(),
      MrMatthew.connect(),
      // Brain1VsBrain2.connect(),
    ])
  },
  disconnectAll () {
    return Promise.all([
      KobayashiNatsumi.disconnect(),
      MrMatthew.disconnect(),
      // Brain1VsBrain2.disconnect(),
    ])
  },
}

export default bots;