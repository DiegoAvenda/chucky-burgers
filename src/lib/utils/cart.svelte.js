// eslint-disable-next-line no-undef
export let cart = $state([]);

export function addToCart(id, product) {
	const existingProduct = cart.find((item) => item.id === id);

	if (existingProduct) {
		existingProduct.quantity += 1;
		return;
	}

	cart.push({ ...product, id, quantity: 1 });
}

export function removeFromCart(productId) {
	const index = cart.findIndex((item) => item.id === productId);
	if (index !== -1) {
		cart.splice(index, 1);
	}
}

export function substractFromCart(productId) {
	const existingProduct = cart.find((item) => item.id === productId);

	if (existingProduct) {
		existingProduct.quantity -= 1;
		if (existingProduct.quantity < 1) {
			removeFromCart(productId);
		}
	}
}
