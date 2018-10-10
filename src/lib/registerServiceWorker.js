export default function registerSW () {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        await navigator.serviceWorker.register('/service-worker.js')
      } catch (e) {
        console.error('SW registration failed: ', e)
      }
    })
  }
}
