<script>
	import { page } from '$app/stores';
	import { cart } from '$lib/utils/cart.svelte.js';
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

	let { data } = $props();

	let coordinates = $state([]); // Para mostrar las coordenadas actuales
	let map;
	let marker;
	let geocoder;

	let totalPrice = $page.params.totalPrice;
	let toggleCheckout = $state(false);

	const mapboxAccessToken =
		'pk.eyJ1IjoiZGF2ZW5kYW5vaCIsImEiOiJjbTNieDh5aDEwejdjMmpwc2ozaGlvYzBkIn0.ZS1jDZX_RbhiMQC8_qJSog';

	onMount(() => {
		if (typeof window !== 'undefined') {
			mapboxgl.accessToken = mapboxAccessToken;

			// Configurar el mapa inicial en caso de usar geolocalización o un centro por defecto
			navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
				enableHighAccuracy: true
			});

			function successLocation(position) {
				setupMap([position.coords.longitude, position.coords.latitude]);
			}

			function errorLocation() {
				setupMap([-99.64907673779962, 20.372424487154948]); // Centro por defecto
			}

			// Inicializar el mapa y el marcador
			function setupMap(center) {
				map = new mapboxgl.Map({
					container: 'customerLocation',
					style: 'mapbox://styles/mapbox/streets-v11',
					center: center,
					zoom: 13
				});

				marker = new mapboxgl.Marker({ draggable: true }).setLngLat(center).addTo(map);

				// Actualizar las coordenadas cuando el marcador sea arrastrado
				marker.on('dragend', updateCoordinates);

				geocoder = new MapboxGeocoder({
					accessToken: mapboxgl.accessToken,
					mapboxgl: mapboxgl,
					marker: false
				});

				// Evento cuando se selecciona una dirección
				geocoder.on('result', (e) => {
					const coords = e.result.center;

					// Mover el marcador existente a la nueva ubicación
					marker.setLngLat(coords);

					// Centrar el mapa en la nueva ubicación
					map.flyTo({ center: coords });

					// Actualizar coordenadas
					updateCoordinates();
				});

				// Agregar el buscador al mapa
				map.addControl(geocoder);
			}
		}
	});

	// Actualizar las coordenadas al mover el marcador
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
				<span>autenticate primero</span>
			{/if}
		</div>
	</div>
</div>
