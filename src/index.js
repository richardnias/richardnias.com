import '@babel/polyfill'
import page from 'page'
import { removeCanvas } from './lib/util'
import registerSW from './lib/registerServiceWorker'

registerSW()

let currentPage

function setActiveLinks (context, next) {
  const oldActive = document.querySelector('.navigation a.active')
  const newActive = document.querySelector(`.navigation a[href="${context.pathname}"]`)
  oldActive && oldActive.classList.remove('active')
  newActive && newActive.classList.add('active')
  next()
}

function stopPreviousPage (context, next) {
  if (currentPage && currentPage.stop && typeof currentPage.stop === 'function') {
    currentPage.stop()
  }
  next()
}

async function routeHandler (context, next) {
  const { route } = context.params
  try {
    const { default: Page } = await import(
      `./pages/${route}.js`
      /* webpackPrefetch: true */
      /* webpackChunkName: "[request]" */
    )
    currentPage = new Page()
    const canvas = await currentPage.init()
    removeCanvas()
    document.body.appendChild(canvas)
    document.body.appendChild(currentPage.stats.dom)
    currentPage.animate()
  } catch (e) {
    console.error(e)
    next()
  }
}

// middleware
page(setActiveLinks)
page(stopPreviousPage)

// routes
page('/', removeCanvas)
page('/:route', routeHandler)
// not found
page('/*', removeCanvas)

page.start()
