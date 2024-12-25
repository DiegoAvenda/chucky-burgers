import Stripe from 'stripe';
import client from '$lib/server/db.js';
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { notifUser } from '$lib/server/push-subscription';

const adminGoogleId = '100935988500638449773';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function POST({ request }) {
	const rawBody = await request.arrayBuffer();

	const event = await stripe.webhooks.constructEvent(
		Buffer.from(rawBody),
		request.headers.get('stripe-signature'),
		STRIPE_WEBHOOK_SECRET
	);

	if (event.type === 'checkout.session.completed') {
		const charge = event.data.object;
		const sessionId = charge.id;
		const customerId = charge.metadata.customerId;
		const location = JSON.parse(charge.metadata.location);
		const address = charge.customer_details.address;

		const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);

		const items = lineItems.data.map((item) => ({
			name: item.description || 'Unknown product',
			quantity: item.quantity,
			total: item.amount_total
		}));
		const totalPrice = charge.amount_total;

		try {
			const mongoClient = await client.connect();
			const db = mongoClient.db('chucky');
			const users = db.collection('users');
			const query = { googleId: customerId };
			const user = await users.findOne(query);
			const customerName = user.name;

			const orders = db.collection('orders');

			await orders.insertOne({
				customerId,
				customerName,
				address,
				location,
				items,
				totalPrice,
				createdAt: new Date(),
				delivered: false,
				prepared: false
			});
			console.log('orden creada');

			notifUser(adminGoogleId, 'Tienes un nuevo pedido');

			//revalidatePath("/")
			//return { successMsg: "order created" }
		} catch (e) {
			console.error(e);
			//return { error: "Failed to create order" }
		}
	}
	return json({ message: 'exito' });
}
