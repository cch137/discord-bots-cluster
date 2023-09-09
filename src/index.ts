import { config as dotenvConfig } from 'dotenv'

dotenvConfig()

import { server, app } from './server'
import logDate from './utils/log-date'
import bots from './bots'
import ch4 from './ch4/index'
import apisRouter from './website/apis'
import oldSiteRedirect from './website/old-site-redirect'
import adminApisRouter from './website/admin-apis'


(async () => {
  await bots.initAll();
  ch4.connect();
})();

app.use('/', apisRouter)
app.use('/', adminApisRouter)
app.use('/', oldSiteRedirect)

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is listening to http://localhost:${port}`);
});

const startedAt = Date.now();
logDate('Started at', startedAt);
