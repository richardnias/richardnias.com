import '@babel/polyfill'
import page from 'page'
import removeCanvas from './lib/removeCanvas'

let stop

function setActiveLinks (context, next) {
  const oldActive = document.querySelector('.navigation a.active')
  const newActive = document.querySelector(`.navigation a[href="${context.pathname}"]`)
  oldActive && oldActive.classList.remove('active')
  newActive && newActive.classList.add('active')
  next()
}

function stopPreviousPage (context, next) {
  if (typeof stop === 'function') {
    stop()
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
    const { default: main } = await import(
      `./pages/${route}.js`
      /* webpackPrefetch: true */
      /* webpackChunkName: "[request]" */
    )
    stop = await main()
  } catch (e) {
    next()
  }
})
// not found
page('/*', removeCanvas)

page.start()
