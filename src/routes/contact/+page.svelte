<script>
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';

	let map;

	const mapboxAccessToken =
		'pk.eyJ1IjoiZGF2ZW5kYW5vaCIsImEiOiJjbTNieDh5aDEwejdjMmpwc2ozaGlvYzBkIn0.ZS1jDZX_RbhiMQC8_qJSog';

	onMount(() => {
		if (typeof window !== 'undefined') {
			mapboxgl.accessToken = mapboxAccessToken;

			setupMap([-117.38316033313538, 33.19500689328807]);

			function setupMap(center) {
				map = new mapboxgl.Map({
					container: 'customerLocation',
					style: 'mapbox://styles/mapbox/streets-v11',
					center: center,
					zoom: 13
				});

				marker = new mapboxgl.Marker().setLngLat(center).addTo(map);
			}
		}
	});
</script>

<div class="mb-5 flex justify-center">
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body items-center text-center">
			<h2 class="card-title justify-center">Contact</h2>
			<p>Mon-Sat, 2:00 PM – 10:00 PM</p>
			<p>digago7@gmail.com</p>
			<p>531-318-1867</p>
			<p>Oceanside, CA.</p>
		</div>
		<figure>
			<div class="h-96 w-96 rounded-xl md:w-[40rem] lg:w-[60rem]" id="customerLocation"></div>
		</figure>
	</div>
</div>
