import '@babel/polyfill'
import page from 'page'
import { removeCanvas } from './lib/util'
import registerSW from './lib/registerServiceWorker'
import hotkeys from 'hotkeys-js'

registerSW()

let currentPage
const inspirationElement = document.querySelector('.inspiration p')

async function fetchNextPage (pageName) {
  const { default: Page } = await import(
    `./pages/${pageName}.js`
    /* webpackPrefetch: true */
    /* webpackChunkName: "[request]" */
  )
  currentPage = new Page()
  const canvas = await currentPage.init()
  removeCanvas()
  setInspiration(currentPage.inspiration)
  document.body.appendChild(canvas)
  currentPage.start()
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

function setInspiration (inspiration) {
  let inspoHtml = ''
  if (inspiration) {
    const { url, title, source } = inspiration
    inspoHtml = `inspired by: <a href="${url}" target="_blank">"${title}" — ${source}</a>`
  }
  inspirationElement.innerHTML = inspoHtml
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
  elements.forEach(function toggleClass (element) {
    element.classList.toggle('hide')
  })
})
