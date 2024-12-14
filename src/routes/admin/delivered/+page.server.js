import client from '$lib/server/db.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.user.admin) {
		return redirect(302, '/');
	}

	try {
		const mongoClient = await client.connect();
		const db = mongoClient.db('chucky');
		const ordersCollection = db.collection('orders');
		const query = { delivered: true };
		const options = { sort: { createdAt: 1 }, projection: { _id: 0 } };

		const rawOrders = await ordersCollection.find(query, options).toArray();
		console.log('raw orders: ', rawOrders);
		const orders = rawOrders.map((order) => ({
			...order,
			createdAt: order.createdAt.toLocaleTimeString('en-US', {
				day: '2-digit',
				month: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				hour12: false
			}),
			deliveredAt: order.deliveredAt.toLocaleTimeString('en-US', {
				day: '2-digit',
				month: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				hour12: false
			})
		}));

		return {
			orders
		};
	} catch (e) {
		console.log(e);
	}
};
