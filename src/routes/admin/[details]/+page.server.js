import client from '$lib/server/db.js';
import { ObjectId } from 'mongodb';
import { fail, redirect } from '@sveltejs/kit';

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
		const rawOrder = await orders.findOne({ _id: objectId }, { projection: { _id: 0 } });

		const order = {
			...rawOrder,
			createdAt: rawOrder.createdAt.toLocaleTimeString('en-US', {
				day: '2-digit',
				month: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				hour12: false
			})
		};

		return {
			order
		};
	} catch (e) {
		console.log(e);
	}
};

export const actions = {
	deliverReading: async ({ request }) => {
		const data = await request.formData();
		const orderId = data.get('orderId');
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
	},
	uploadFile: async ({ request }) => {
		const data = await request.formData();
		const readingId = data.get('readingId');
		const file = data.get('file');
		const orderId = data.get('orderId');
		const objectId = new ObjectId(orderId);

		try {
			//Verify image is valid
			if (!(file instanceof File)) {
				throw new Error('file must be a file');
			}

			if (file.size === 0) {
				throw new Error('File cannot be empty');
			}

			//converts file to a Buffer
			const fileBuffer = Buffer.from(await file.arrayBuffer());

			const mongoClient = await client.connect();
			const db = mongoClient.db('chucky');
			const orders = db.collection('orders');
			const filter = { _id: objectId };
			const updateDoc = {
				$set: {
					'items.$[item].reading': fileBuffer
				}
			};
			const arrayFilters = [{ 'item.readingId': readingId }];
			await orders.updateOne(filter, updateDoc, { arrayFilters });
		} catch (error) {
			if (error instanceof Error) {
				return fail(400, { message: error.message });
			}

			return fail(400, {
				message: 'Unknown error ocurred while uploading file'
			});
		}
	}
};
