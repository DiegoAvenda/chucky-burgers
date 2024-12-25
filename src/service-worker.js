self.addEventListener('push', function (event) {
	const payload = event.data ? event.data.text() : 'no payload';

	event.waitUntil(
		self.registration.showNotification('ServiceWorker Cookbook', {
			body: payload
		})
	);
});

self.addEventListener('notificationclick', function (event) {
	event.notification.close();

	const urlToOpen = 'https://chucky-burgers.vercel.app/';

	event.waitUntil(
		clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
			for (const client of clientList) {
				if (client.url === urlToOpen && 'focus' in client) {
					return client.focus();
				}
			}

			if (clients.openWindow) {
				return clients.openWindow(urlToOpen);
			}
		})
	);
});
