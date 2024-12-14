<script>
	import { products } from '$lib/utils/products';
	import { addToCart } from '$lib/utils/cart.svelte.js';
</script>

<div class="m-8">
	<div class="flex justify-center">
		<h1 class="text-4xl font-bold">Menu</h1>
	</div>
	<div
		class="m-9 flex flex-col items-center gap-2 md:grid md:grid-cols-2 lg:grid-cols-3 lg:justify-center"
	>
		{#each products as product, i}
			<div class="card card-bordered card-compact w-96 bg-base-100 shadow-xl">
				<figure>
					<img alt={product.name} src={product.image} />
				</figure>
				<div class="card-body">
					<h2 class="card-title">
						{product.name}
					</h2>
					<p>${product.price}</p>
					<div class="card-actions justify-end">
						<button onclick={() => addToCart(i, product)} class="btn btn-primary"
							>Add to cart</button
						>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
