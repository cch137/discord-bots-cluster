import { server } from './server'
import bots from './bots'
import oldSiteRedirect from './website/old-site-redirect'
import logDate from './utils/log-date'

const port = process.env.PORT || 5000;

(async () => {
  await bots.initAll();
})();

server.listen(port, () => {
  oldSiteRedirect();
  console.log(`Server is listening to http://localhost:${port}`);
});

const startedAt = Date.now();
logDate('Started at', startedAt);
