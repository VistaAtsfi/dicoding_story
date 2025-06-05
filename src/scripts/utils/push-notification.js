import api from '../data/api';

const PushNotificationHelper = {
    async init() {
        if (!('Notification' in window) || !('serviceWorker' in navigator)) return;
        const status = await Notification.requestPermission();
        if (status === 'granted') this.updateSubscriptionStatus(true);
    },

    async toggleSubscription(enable) {
        const registration = await navigator.serviceWorker.ready;
        const token = localStorage.getItem('token');
        if (!token) return;

        if (enable) {
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array('BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk'),
            });
            const payload = {
                endpoint: subscription.endpoint,
                keys: {
                    p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')))),
                    auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')))),
                },
            };
            await api.subscribePush(payload, token);
            this.updateSubscriptionStatus(true);
        } else {
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
                await api.unsubscribePush(subscription.endpoint, token);
                await subscription.unsubscribe();
            }
            this.updateSubscriptionStatus(false);
        }
    },

    updateSubscriptionStatus(enabled) {
        const toggle = document.getElementById('push-toggle');
        if (toggle) toggle.checked = enabled;
    },

    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
        const raw = atob(base64);
        return new Uint8Array([...raw].map(char => char.charCodeAt(0)));
    },
};

export default PushNotificationHelper;