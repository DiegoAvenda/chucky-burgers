<script>
	import { page } from '$app/stores';
	import { cart } from '$lib/utils/cart.svelte.js';
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';

	let { data } = $props();
	const order = data.order;
	let map;
	let marker;

	console.log('location: ', data.location);

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

<div id="customerLocation" style="width: 100%; height: 500px;"></div>
