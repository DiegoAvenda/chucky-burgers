<script>
	let { data } = $props();
</script>

<div class="mt-6 flex flex-col items-center">
	<h1 class="flex justify-center text-3xl font-bold">Pending orders</h1>

	<div class="my-6 flex flex-col items-center gap-1">
		{#each data.orders as order (order._id)}
			<div class="card card-bordered card-compact w-96 bg-base-100 shadow-xl">
				<div class="card-body items-center text-center">
					<p class="card-title">Customer: {order.customerName}</p>
					<p>Created at: {order.createdAt}</p>

					<table class="table">
						<thead>
							<tr>
								<th>Dish</th>
								<th>Quantity</th>
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
					<div class="card-a-ctions flex gap-1">
						<a href={`/admin/${order._id}`}> <button class="btn">See location</button></a>
						<form method="post">
							<input type="hidden" name="orderId" value={order._id} />
							<button class="btn btn-primary">Mark as prepared</button>
						</form>
					</div>
				</div>
			</div>
		{/each}
	</div>

	{#if data.orders.length === 0}
		<p>You don't have pending orders</p>
	{/if}
</div>
