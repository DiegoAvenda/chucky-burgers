import { redirect } from '@sveltejs/kit';
import client from '$lib/server/db.js';

export const load = async ({ locals, url }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}

	const fromStripe = url.searchParams.get('from_stripe') === 'yes';

	const username = locals.user.name;
	const customerId = locals.user.googleId;

	try {
		const mongoClient = await client.connect();
		const db = mongoClient.db('chucky');
		const ordersCollection = db.collection('orders');
		const query = { customerId, delivered: false };
		const options = {
			sort: { createdAt: -1 },
			projection: { _id: 0 }
		};

		const rawOrders = await ordersCollection.find(query, options).toArray();

		const orders = rawOrders.map((order) => ({
			...order,
			createdAt: order.createdAt.toLocaleTimeString('en-US', {
				hour: '2-digit',
				minute: '2-digit',
				hour12: true
			})
		}));

		return {
			orders,
			username,
			fromStripe
		};
	} catch (e) {
		console.log(e);
	}
};
