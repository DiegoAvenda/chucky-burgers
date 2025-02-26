<script>
	let { data } = $props();
	import { onMount } from 'svelte';

	let nottifPermGranted = $state(null);
	let isSubscribed = $state(false);

	onMount(async () => {
		nottifPermGranted = Notification.permission === 'granted';

		if (nottifPermGranted) {
			isSubscribed = await checkSubscriptionStatus();

			if (!isSubscribed) {
				await subscribeUser();
			}
		}
	});

	function requestNotificationPermission() {
		Notification.requestPermission().then((permission) => {
			if (permission === 'granted') {
				new Notification('You are now subscribed to notifications!');
			}
		});
	}

	async function sendSubscriptionToServer(subscription) {
		try {
			const res = await fetch('/api/addSubscription', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ subscription })
			});
			if (!res.ok)
				throw new Error(`Error saving subscription on server: ${res.statusText} (${res.status})`);
		} catch (error) {
			console.error('Error saving subscription on server:', error);
			unsubscribe();
		}
	}

	async function checkSubscriptionStatus() {
		if ('serviceWorker' in navigator) {
			const registration = await navigator.serviceWorker.ready;
			const subscription = await registration.pushManager.getSubscription();
			console.log('Subscription:', subscription);
			const exists = subscription !== null;
			if (exists) {
				// just to make sure the subscription is saved on the server
				sendSubscriptionToServer(subscription);
			}
			return exists;
		}
		return false;
	}

	async function subscribeUser() {
		if ('serviceWorker' in navigator) {
			try {
				const res = await fetch('/api/vapidPubKey');
				const { data } = await res.json();

				const registration = await navigator.serviceWorker.ready;
				const subscription = await registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: data
				});
				isSubscribed = true;
				console.log('Subscription:', JSON.stringify(subscription));
				sendSubscriptionToServer(subscription);
			} catch (err) {
				console.error('Error subscribing:', err);
			}
		}
	}

	async function unsubscribe() {
		if ('serviceWorker' in navigator) {
			const registration = await navigator.serviceWorker.ready;
			const subscription = await registration.pushManager.getSubscription();
			if (subscription) {
				await subscription.unsubscribe();
				isSubscribed = false;
			}
		}
	}
</script>

<div class="px-4">
	<h1>Profile page</h1>
	<p>Welcome {data.userName}</p>

	<div class="mt-4">
		<div class="mt-3">
			{#if nottifPermGranted === null}
				<p>Checking permissions...</p>
				<button class="btn" type="button" onclick={requestNotificationPermission}
					>Enable notifications</button
				>
			{:else if nottifPermGranted === false}
				<button class="btn" type="button" onclick={requestNotificationPermission}
					>Enable notifications</button
				>
			{:else}
				<p>You have enabled notification permissions.</p>
				<p>Subscribed to push notifications: <b>{isSubscribed}</b></p>
				{#if isSubscribed}
					<div>
						<button class="btn" type="button" onclick={unsubscribe}>Unsubscribe</button>
					</div>
					<div class="mt-4">
						<form method="post" action="?/testNotification">
							<button class="btn" type="submit">Test Notification</button>
						</form>
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>
