<script>
	import { page } from '$app/stores';
	import { cart } from '$lib/utils/cart.svelte.js';
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

	let { data } = $props();

	let coordinates = $state(''); // Para mostrar las coordenadas actuales
	let map;
	let marker;
	let geocoder;
	let fullAddress = $state('');
	let street = $state('');
	let zip = $state('');
	let city = $state('');
	let state = $state('');

	let totalPrice = $page.params.totalPrice;
	let toggle = $state(false);

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
					container: 'mapa',
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

	//"https://api.mapbox.com/search/geocode/v6/reverse?longitude=-73.989&latitude=40.733&access_token=pk.eyJ1IjoiZGF2ZW5kYW5vaCIsImEiOiJjbTNieDh5aDEwejdjMmpwc2ozaGlvYzBkIn0.ZS1jDZX_RbhiMQC8_qJSog"

	// Confirmar la ubicación y realizar reverse geocoding
	async function confrimAddress() {
		if (!coordinates || coordinates.length === 0) {
			alert('Please select a location on the map');
			return;
		}

		try {
			// Llamada al API de reverse geocoding
			const [longitude, latitude] = coordinates;
			const response = await fetch(
				`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&access_token=${mapboxAccessToken}`
			);

			if (!response.ok) {
				throw new Error('failed to fetch address');
			}

			const result = await response.json();

			const properties = result.features?.[0]?.properties || {};

			fullAddress = properties.full_address || 'Address not found';
			street = properties.name || '';
			const formatted = properties.place_formatted?.split(',') || [];
			zip = formatted[0]?.split(' ')[0] || '';
			city = formatted[0]?.split(' ')[1] || '';
			state = formatted[1]?.trim() || '';
		} catch (error) {
			console.error('Error fetching reverse geocoding:', error);
		}
	}

	//stripe checkout

	const location = $derived(JSON.stringify(coordinates));

	async function checkout() {
		if (data.customerId === null) {
			toggle = true;
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
				console.log('data.url: ', data.url);
				window.location.replace(data.url);
			});
	}
</script>

<h1>Select your location</h1>
<div id="mapa" style="width: 100%; height: 500px;"></div>
<button class="btn" onclick={() => confrimAddress()}>confirm address</button>

<p>checkout total price: ${totalPrice}</p>

<div class="my-4 flex flex-col items-center">
	<div class="card card-bordered flex w-96 flex-col">
		<div class="card-body">
			<form>
				<h2 class="card-title">Complete and confirm your delivery address</h2>

				<label class="input input-bordered flex items-center gap-2">
					Calle:
					<input type="text" value={street} disabled />
				</label>

				<label class="input input-bordered flex items-center gap-2">
					ZIP:
					<input type="text" value={zip} disabled />
				</label>

				<label class="input input-bordered flex items-center gap-2">
					City:
					<input type="text" value={city} disabled />
				</label>

				<label class="input input-bordered flex items-center gap-2">
					State:
					<input type="text" value={state} disabled />
				</label>

				<label class="input input-bordered flex items-center gap-2">
					Street Number:
					<input type="text" placeholder="Ejemplo: 12B" />
				</label>

				<div class="card-actions justify-end">
					<button class="btn" onclick={() => checkout()}>Confirm location & go to checkout</button>
				</div>
			</form>
		</div>
	</div>
</div>
{#if toggle}
	<p>autenticate primero</p>
{/if}
