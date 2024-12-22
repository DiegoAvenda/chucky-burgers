<script>
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';

	let { data } = $props();

	const order = data.order;

	const location = order.location;
	const address = order.address;

	const { line1, line2, postal_code, city, state, country } = address;

	let map;
	let marker;

	onMount(() => {
		if (typeof window !== 'undefined') {
			mapboxgl.accessToken =
				'pk.eyJ1IjoiZGF2ZW5kYW5vaCIsImEiOiJjbTNieDh5aDEwejdjMmpwc2ozaGlvYzBkIn0.ZS1jDZX_RbhiMQC8_qJSog';

			// Inicializar el mapa y el marcador
			function setupMap(center) {
				map = new mapboxgl.Map({
					container: 'customerLocation',
					style: 'mapbox://styles/mapbox/streets-v11',
					center: center,
					zoom: 13
				});

				marker = new mapboxgl.Marker().setLngLat(center).addTo(map);
			}

			setupMap(order.location);
		}
	});
</script>

<div class="hero min-h-screen bg-base-200">
	<div class="hero-content flex-col">
		<div class=" h-[30rem] w-96 md:w-[40rem] lg:w-[60rem]" id="customerLocation"></div>

		<div class="card card-bordered card-compact bg-base-100 shadow-md">
			<div class="card-body">
				<h2 class="card-title">Address</h2>
				<p><span class="font-semibold">Line 1:</span> {line1}</p>
				{#if line2}
					<p><span class="font-semibold">Line 2:</span> {line2}</p>
				{/if}
				<p><span class="font-semibold">Zip code:</span> {postal_code}</p>
			</div>
		</div>

		<div class="card card-bordered card-compact w-96 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">{order.customerName}</h2>
				<p>Created at {order.createdAt}</p>
				{#if order.prepared}
					<p>Prepared at {order.preparedAt}</p>
				{/if}
				<table class="table">
					<thead>
						<tr>
							<th>Dish</th>
							<th>Qty</th>
						</tr>
					</thead>
					<tbody>
						{#each order.items as item}
							<tr>
								<th>{item.name}</th>
								<td>{item.quantity}</td>
							</tr>
						{/each}
					</tbody>
				</table>
				<p class="font-bold">Total price ${order.totalPrice}</p>
			</div>
		</div>

		{#if order.prepared}
			{#if order.delivered}
				<p class="text-lg">Delivered at {order.deliveredAt}</p>
			{:else}
				<form method="post">
					<input type="hidden" name="orderId" value={order._id} />
					<button class="btn btn-primary">Mark as delivered</button>
				</form>
			{/if}
		{/if}
	</div>
</div>
