import '@babel/polyfill'
import page from 'page'
import { removeCanvas } from './lib/util'
import registerSW from './lib/registerServiceWorker'
import hotkeys from 'hotkeys-js'
registerSW()

let currentPage

async function fetchNextPage (pageName) {
  const { default: Page } = await import(
    `./pages/${pageName}.js`
    /* webpackPrefetch: true */
    /* webpackChunkName: "[request]" */
  )
  currentPage = new Page()
  const canvas = await currentPage.init()
  removeCanvas()
  document.body.appendChild(canvas)
  currentPage.animate()
}

function stopPreviousPage (context, next) {
  if (currentPage && currentPage.stop && typeof currentPage.stop === 'function') {
    currentPage.stop()
  }
  next()
}

function setActiveLinks (context, next) {
  const oldActive = document.querySelector('.navigation a.active')
  const newActive = document.querySelector(`.navigation a[href="${context.pathname}"]`)
  oldActive && oldActive.classList.remove('active')
  newActive && newActive.classList.add('active')
  next()
}

async function routeHandler (context, next) {
  const { route } = context.params
  try {
    await fetchNextPage(route)
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

hotkeys('h', function toggleText () {
  const elements = document.querySelectorAll('.hideable')
  elements.forEach(function toggleClass(element) {
    element.classList.toggle('hide')
  })
})
