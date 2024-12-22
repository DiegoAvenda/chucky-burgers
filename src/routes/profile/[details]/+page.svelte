<script>
	let { data, form } = $props();

	const order = data.order;
</script>

<div class="m-4 flex flex-col items-center">
	<h1>Order details page</h1>
	{#if data.order.delivered}
		<h2>Delivered order</h2>
	{:else}
		<h2>Pending order</h2>
	{/if}

	<div class="m-4">
		<p>${order.totalPrice}</p>
		{#each order.items as item}
			<p>{item.name}</p>
			<p>{item.personalization}</p>

			{#if order.delivered}
				<img class="w-20" src="data:image/jpeg;base64,{item.reading}" alt="Reading" />
			{/if}
		{/each}

		Created at: {order.createdAt}
		{#if order.delivered}
			Delivered at: {order.deliveredAt}
		{/if}
	</div>
</div>
