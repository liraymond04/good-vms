// Load environment variables
import dotenv from 'dotenv';

dotenv.config({ override: true });

import { IS_MAINNET } from '@good/data/constants';
import logger from '@good/helpers/logger';
import cors from 'cors';
import express from 'express';
import { router } from 'express-file-routing';
import { createPublicClient, webSocket } from 'viem';
import { polygon, polygonAmoy } from 'viem/chains';
import ViteExpress from 'vite-express';

// Load environment variables
const path = require('path')
dotenv.config({ override: true, path: path.resolve(__dirname, '../.env.local') });
import limitDomains from './helpers/middlewares/limitDomains';
import listenCauses from './listeners/cause-listener';
import listenDonations from './listeners/donation-listener';

const app = express();

app.disable('x-powered-by');

// Middleware configuration
app.use(cors());
app.use(limitDomains);
app.use(express.json({ limit: '1mb' }));

//  Increase request timeout
app.use((req, _, next) => {
  req.setTimeout(120000); // 2 minutes
  next();
});

// Log request aborted
app.use((req, _, next) => {
  req.on('aborted', () => {
    logger.error('Request aborted by the client');
  });
  next();
});

const setupRoutes = async () => {
  // Route configuration
  app.use('/', await router());

  // Start the server
  ViteExpress.listen(app, 4784, () => {
    logger.info('Server is listening on port 4784...');
  });
};

const createClient = () =>
  createPublicClient({
    chain: IS_MAINNET ? polygon : polygonAmoy,
    transport: webSocket('wss://polygon-amoy-bor-rpc.publicnode.com')
  });

export type ListenerClient = ReturnType<typeof createClient>;

const setupListeners = () => {
  const publicClient = createClient();
  listenDonations(publicClient);
  listenCauses(publicClient);
};

try {
  setupListeners();
} catch (error) {
  logger.error(`Error setting up listeners: ${error}`);
}

// Initialize routes
setupRoutes().catch((error) => {
  logger.error('Error setting up routes', error);
});
