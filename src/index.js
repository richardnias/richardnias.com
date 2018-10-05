// async polyfill
import 'regenerator-runtime/runtime'
import page from 'page'

let stop

function setActiveLinks (context, next) {
  document.querySelector('.navigation a.active').classList.remove('active')
  document.querySelector(`.navigation a[href="${context.pathname}"]`).classList.add('active')
  next()
}

function makeRoute (jsFile) {
  return async function () {
    const { default: main } = await import(jsFile)
    if (typeof stop === 'function') {
      stop()
    }
    stop = await main()
  }
}

const mountains = makeRoute('./mountains.js')
const oblong = makeRoute('./oblong.js')
const rgb = makeRoute('./rgb.js')
const index = rgb
const notFound = oblong

page(setActiveLinks)
page('/', index)
page('/rgb', rgb)
page('/mountains', mountains)
page('/oblong', notFound)
page('*', notFound)
page.start()
