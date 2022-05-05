import KToast from './KToast.vue'

export function installToastApp() {
  const rootEl = document.createElement('div')
  document.body.appendChild(rootEl)

  const app = createApp(KToast).mount(rootEl)

  return app
}
