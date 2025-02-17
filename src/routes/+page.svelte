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

<div class="hero min-h-screen" style="background-image: url(/images/hero-burger.webp);">
	<div class="hero-overlay bg-opacity-60"></div>
	<div class="hero-content text-center text-neutral-content">
		<div class="max-w-md">
			<h1 class="mb-5 text-5xl font-bold">Svelte Burgers</h1>
			<p class="mb-5 max-w-md break-words">
				Juicy, handcrafted burgers made to satisfy! Fresh ingredients, bold flavors, and the perfect
				bite—every time. Order now!
			</p>

			<button class="btn btn-primary"> <a href="/menu">See menu</a></button>
		</div>
	</div>
</div>

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
