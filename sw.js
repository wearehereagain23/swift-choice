self.addEventListener("push", (event) => {
    console.log("📩 [SW] Push event fired");

    if (!event.data) {
        console.warn("⚠️ [SW] Push had no data");
        return;
    }

    const rawData = event.data.text();
    console.log("📦 [SW] Raw push payload:", rawData);

    let data = {};
    try {
        data = event.data.json();
        console.log("✅ [SW] Parsed JSON payload:", data);
    } catch (e) {
        console.warn("⚠️ [SW] Fallback to text");
        data = { title: "Notification", body: rawData };
    }

    const options = {
        body: data.body || "You have a new message",
        icon: data.icon || "https://via.placeholder.com/192",
        badge: "https://via.placeholder.com/72",
    };

    console.log("🔔 [SW] Showing notification:", data.title, options);

    event.waitUntil(
        self.registration.showNotification(data.title || "New Alert", options)
    );
});

self.addEventListener("notificationclick", (event) => {
    console.log("👆 [SW] Notification clicked:", event.notification);
    event.notification.close();
    event.waitUntil(clients.openWindow("/"));
});
