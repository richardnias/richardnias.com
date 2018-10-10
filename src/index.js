// async polyfill
import 'regenerator-runtime/runtime'
import page from 'page'

let stop

function setActiveLinks (context, next) {
  document.querySelector('.navigation a.active').classList.remove('active')
  document.querySelector(`.navigation a[href="${context.pathname}"]`).classList.add('active')
  next()
}

function makeRoute (loader) {
  return async function () {
    try {
      const {default: main} = await loader()
      if (typeof stop === 'function') {
        stop()
      }
      stop = await main()
    } catch (e) {
      console.error('Error loading next route.', e)
    }
  }
}

const mountains = makeRoute(() => import(
  /* webpackChunkName: "mountains" */
  /* webpackPrefetch: true */
  './mountains.js'))
const oblong = makeRoute(() => import(
  /* webpackChunkName: "oblong" */
  /* webpackPrefetch: true */
  './oblong.js'))
const rgb = makeRoute(() => import(
  /* webpackChunkName: "rgb" */
  /* webpackPrefetch: true */
  './rgb.js'))
const index = rgb
const notFound = oblong

page(setActiveLinks)
page('/', index)
page('/rgb', rgb)
page('/mountains', mountains)
page('/oblong', notFound)
page('*', notFound)
page.start()
