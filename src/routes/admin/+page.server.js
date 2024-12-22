import client from '$lib/server/db.js';
import { redirect } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

export const load = async ({ locals }) => {
	if (!locals.user.admin) {
		return redirect(302, '/');
	}

	try {
		const mongoClient = await client.connect();
		const db = mongoClient.db('chucky');
		const ordersCollection = db.collection('orders');
		const query = { prepared: false };
		const rawOrders = await ordersCollection.find(query, { sort: { createdAt: -1 } }).toArray();

		const orders = rawOrders.map((order) => ({
			...order,
			_id: order._id.toString(),
			createdAt: order.createdAt.toLocaleTimeString('en-US', {
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

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const orderId = data.get('orderId');
		console.log('order id: ', orderId);
		const objectId = new ObjectId(orderId);

		try {
			const mongoClient = await client.connect();
			const db = mongoClient.db('chucky');
			const orders = db.collection('orders');
			const filter = { _id: objectId };
			const updateDoc = {
				$set: {
					prepared: true,
					preparedAt: new Date()
				}
			};

			await orders.updateOne(filter, updateDoc);
		} catch (error) {
			console.log(error);
		}
	}
};
