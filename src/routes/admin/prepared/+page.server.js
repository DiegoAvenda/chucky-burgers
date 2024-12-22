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
		const query = { prepared: true, delivered: false };
		const rawOrders = await ordersCollection.find(query, { sort: { prepareddAt: -1 } }).toArray();

		const orders = rawOrders.map((order) => ({
			...order,
			_id: order._id.toString(),
			createdAt: order.createdAt.toLocaleTimeString('en-US', {
				hour: '2-digit',
				minute: '2-digit',
				hour12: true
			}),
			preparedAt: order.createdAt.toLocaleTimeString('en-US', {
				hour: '2-digit',
				minute: '2-digit',
				hour12: true
			})
		}));

		return {
			orders,
			userPicture: locals.user.picture,
			username: locals.user.name
		};
	} catch (e) {
		console.log(e);
	}
};
