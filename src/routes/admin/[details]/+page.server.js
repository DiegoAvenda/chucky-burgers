import client from '$lib/server/db.js';
import { ObjectId } from 'mongodb';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
	if (!locals.user.admin) {
		return redirect(302, '/');
	}
	const orderId = params.details;
	const objectId = new ObjectId(orderId);

	try {
		const mongoClient = await client.connect();
		const db = mongoClient.db('chucky');
		const orders = db.collection('orders');
		const rawOrder = await orders.findOne({ _id: objectId });

		const order = {
			...rawOrder,
			_id: rawOrder._id.toString(),
			createdAt: rawOrder.createdAt.toLocaleTimeString('en-US', {
				day: '2-digit',
				month: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				hour12: false
			}),
			preparedAt: rawOrder.preparedAt
				? rawOrder.preparedAt.toLocaleTimeString('en-US', {
						day: '2-digit',
						month: '2-digit',
						hour: '2-digit',
						minute: '2-digit',
						hour12: false
					})
				: null,
			deliveredAt: rawOrder.deliveredAt
				? rawOrder.deliveredAt.toLocaleTimeString('en-US', {
						day: '2-digit',
						month: '2-digit',
						hour: '2-digit',
						minute: '2-digit',
						hour12: false
					})
				: null
		};

		return {
			order
		};
	} catch (e) {
		console.log(e);
	}
};

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const orderId = data.get('orderId');
		console.log('action order id: ', orderId);
		const objectId = new ObjectId(orderId);

		try {
			const mongoClient = await client.connect();
			const db = mongoClient.db('chucky');
			const orders = db.collection('orders');
			const filter = { _id: objectId };
			const updateDoc = {
				$set: {
					delivered: true,
					deliveredAt: new Date()
				}
			};

			await orders.updateOne(filter, updateDoc);
		} catch (error) {
			console.log(error);
		}
	}
};
