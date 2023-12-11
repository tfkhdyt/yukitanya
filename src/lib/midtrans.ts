import { MidtransClient } from 'midtrans-node-client';

import { environment } from '@/environment.mjs';

export const snap = new MidtransClient.Snap({
	isProduction: environment.NODE_ENV === 'production',
	serverKey: environment.MIDTRANS_SERVER_KEY,
	clientKey: environment.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});
