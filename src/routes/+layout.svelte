<script>
	import '../app.css';
	import Navbar from '../lib/components/navbar.svelte';
	import Footer from '$lib/components/footer.svelte';

	let { data, children } = $props();
</script>

<svelte:head>
	<title>Chucky burgers</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Navbar
		customerLastMessageFrom={data.customerLastMessageFrom}
		username={data.username}
		admin={data.admin}
		userPicture={data.userPicture}
	/>
	<div class="grow">
		{@render children()}
	</div>
	<Footer />
</div>
