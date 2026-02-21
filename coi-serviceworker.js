/*! coi-serviceworker v0.1.7 - git.io/coi-serviceworker */
if (typeof window === 'undefined') {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

    self.addEventListener("fetch", (event) => {
        const { request } = event;
        if (request.cache === "only-if-cached" && request.mode !== "same-origin") {
            return;
        }

        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response.status === 0) {
                        return response;
                    }

                    const newHeaders = new Headers(response.headers);
                    newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
                    newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");

                    return new Response(response.body, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: newHeaders,
                    });
                })
                .catch((e) => console.error(e))
        );
    });
} else {
    const script = document.currentScript;
    script.src = 'coi-serviceworker.js';
    const coep = 'require-corp';
    const coop = 'same-origin';

    if (window.crossOriginIsolated !== undefined && !window.crossOriginIsolated && window.location.protocol === 'https:') {
        navigator.serviceWorker.register(window.location.pathname + window.location.search).then((registration) => {
            registration.addEventListener("updatefound", () => {
                registration.installing.addEventListener("statechange", (event) => {
                    if (event.target.state === "installed") {
                        window.location.reload();
                    }
                });
            });
        });
    }
}
