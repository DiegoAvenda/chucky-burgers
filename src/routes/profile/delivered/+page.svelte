<script>
	let { data } = $props();
</script>

<div class="mt-6 flex flex-col items-center">
	<h1 class="flex justify-center text-3xl font-bold">Delivered orders</h1>

	<div class="my-6 flex flex-col items-center gap-1">
		{#each data.orders as order}
			<div class="card card-bordered card-compact w-96 bg-base-100 shadow-xl">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<p class="text-xl font-bold">Ordered at {order.createdAt}</p>
					</div>
					<table class="table">
						<thead>
							<tr>
								<th>Dish</th>
								<th>Qty</th>
								<th>Total</th>
							</tr>
						</thead>
						<tbody>
							{#each order.items as item}
								<tr>
									<th>{item.name}</th>
									<td>{item.quantity}</td>
									<td>${item.total}</td>
								</tr>
							{/each}
						</tbody>
					</table>
					<div class="flex items-center justify-between">
						<p class="font-bold">Total price ${order.totalPrice}</p>
						<p>Delivered at {order.deliveredAt}</p>
					</div>
				</div>
			</div>
		{/each}
	</div>

	{#if data.orders.length === 0}
		<p class="m-8">You don't have pending orders</p>
	{/if}
</div>
