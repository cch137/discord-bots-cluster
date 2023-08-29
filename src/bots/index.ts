import KobayashiNatsumi from "./kobayashi-natsumi";
import MrMatthew from "./mr-matthew";
import Brain1 from "./brain1";
import Brain2 from "./brain2";

const bots = {
  KobayashiNatsumi,
  MrMatthew,
  Brain1,
  Brain2,
  initAll () {
    return Promise.all([
      KobayashiNatsumi.init(),
      MrMatthew.init(),
      Brain1.connect(),
      Brain2.connect(),
    ])
  },
  connectAll () {
    return Promise.all([
      KobayashiNatsumi.connect(),
      MrMatthew.connect(),
      Brain1.connect(),
      Brain2.connect(),
    ])
  },
  disconnectAll () {
    return Promise.all([
      KobayashiNatsumi.disconnect(),
      MrMatthew.disconnect(),
      Brain1.disconnect(),
      Brain2.disconnect(),
    ])
  },
}

export default bots;