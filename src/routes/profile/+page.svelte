<script>
	import { onMount } from 'svelte';
	import { Toaster, toast } from 'svelte-sonner';
	let { data } = $props();
</script>

<div class="mt-6 flex flex-col items-center">
	<h1 class="flex justify-center text-3xl font-bold">Pending orders</h1>

	<div class="my-6 flex flex-col items-center gap-1">
		{#each data.orders as order}
			<div class="card card-bordered card-compact w-96 bg-base-100 shadow-xl">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<h2 class="card-title">Ordered at {order.createdAt}</h2>
					</div>
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
		{/each}
	</div>

	{#if data.orders.length === 0}
		<p class="m-8">You don't have pending orders</p>
	{/if}
</div>
