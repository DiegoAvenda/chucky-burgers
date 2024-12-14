import client from '$lib/server/db.js';
import { ObjectId } from 'mongodb';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
	if (!locals.user?.admin) {
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
			items: rawOrder.items.map((item) => ({
				...item,
				reading: item.reading ? item.reading.toString('base64') : null // Convierte solo si reading existe
			}))
		};

		return {
			order
		};
	} catch (e) {
		console.log(e);
	}
};
