<script>
	let { data } = $props();
</script>

<div class="prose mt-2 flex justify-center">
	<h1>Pending orders</h1>
</div>

<div class="my-6 flex flex-col items-center gap-1">
	{#each data.orders as order}
		<div class="card card-bordered card-compact w-96 bg-base-100 shadow-xl">
			<div class="card-body">
				<div class="flex items-center justify-between">
					<p class="text-xl font-bold">{order.customerName}</p>
					<p>{order.createdAt}</p>
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
				<p class="font-bold">Total price ${order.totalPrice}</p>
				<div class="card-a-ctions flex justify-end">
					<button class="btn btn-primary">Ready</button>
					<a href={`/admin/${order._id}`}> <button>See location</button></a>
				</div>
			</div>
		</div>
	{/each}
</div>
