import { MIDTRANS_CLIENT_KEY, MIDTRANS_SERVER_KEY } from '@/config';

const midtransClient = require('midtrans-client');

let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY,
});
