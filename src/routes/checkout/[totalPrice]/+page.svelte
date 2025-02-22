<script>
	import { page } from '$app/stores';
	import { cart } from '$lib/utils/cart.svelte.js';
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
	import { PUBLIC_MAPBOX_KEY } from '$env/static/public';

	let { data } = $props();

	let coordinates = $state([]);
	let map;
	let marker;
	let geocoder;

	let totalPrice = $page.params.totalPrice;
	let toggleCheckout = $state(false);

	onMount(() => {
		if (typeof window !== 'undefined') {
			mapboxgl.accessToken = PUBLIC_MAPBOX_KEY;

			navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
				enableHighAccuracy: true
			});

			function successLocation(position) {
				setupMap([position.coords.longitude, position.coords.latitude]);
			}

			function errorLocation() {
				setupMap([-122.4194, 37.7749]);
			}

			function setupMap(center) {
				map = new mapboxgl.Map({
					container: 'customerLocation',
					style: 'mapbox://styles/mapbox/streets-v11',
					center: center,
					zoom: 13
				});

				marker = new mapboxgl.Marker({ draggable: true }).setLngLat(center).addTo(map);

				marker.on('dragend', updateCoordinates);

				geocoder = new MapboxGeocoder({
					accessToken: mapboxgl.accessToken,
					mapboxgl: mapboxgl,
					marker: false
				});

				geocoder.on('result', (e) => {
					const coords = e.result.center;

					marker.setLngLat(coords);

					map.flyTo({ center: coords });

					updateCoordinates();
				});

				map.addControl(geocoder);
			}
		}
	});

	function updateCoordinates() {
		const lngLat = marker.getLngLat();
		coordinates = [lngLat.lng, lngLat.lat];
	}

	//stripe checkout

	const location = $derived(JSON.stringify(coordinates));

	async function checkout() {
		if (data.customerId === null) {
			toggleCheckout = true;
			return;
		}

		if (!coordinates || coordinates.length === 0) {
			alert('Please select a location on the map');
			return;
		}

		await fetch('/api/stripe/checkout', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ items: cart, customerId: data.customerId, location })
		})
			.then((data) => {
				return data.json();
			})
			.then((data) => {
				window.location.replace(data.url);
			});
	}
</script>

<div class="m-6 flex justify-center">
	<div class="card bg-base-100 shadow-xl">
		<h2 class="card-title justify-center">Select your location</h2>
		<figure class="px-10 pt-10">
			<div class=" h-96 w-96 md:w-[40rem] lg:w-[60rem]" id="customerLocation"></div>
		</figure>
		<div class="card-body items-center text-center">
			<div class="card-actions">
				<button onclick={() => checkout()} class="btn btn-primary"
					>Confirm location & go to checkout</button
				>
			</div>
			{#if toggleCheckout}
				<span>Please <a class="link" href="/login">login</a> first</span>
			{/if}
		</div>
	</div>
</div>
