import '@babel/polyfill'
import page from 'page'
import removeCanvas from './lib/removeCanvas'

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

// middleware
page(setActiveLinks)
page(stopPreviousPage)

// routes
page('/', removeCanvas)
page('/:route', async function (context, next) {
  const { route } = context.params
  try {
    const { default: Page } = await import(
      `./pages/${route}.js`
      /* webpackPrefetch: true */
      /* webpackChunkName: "[request]" */
    )
    currentPage = await new Page()
  } catch (e) {
    next()
  }
})
// not found
page('/*', removeCanvas)

page.start()
