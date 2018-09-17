// async polyfill
import 'regenerator-runtime/runtime'
import page from 'page'

let stop

async function mountains () {
  const {default: main} = await import('./mountains.js')
  if (typeof stop === 'function') {
    stop()
  }
  stop = main()
}

async function oblong () {
  const {default: main} = await import('./oblong.js')
  if (typeof stop === 'function') {
    stop()
  }
  stop = main()
}

const index = mountains
const notFound = mountains

page('/', index)
page('/mountains', mountains)
page('/oblong', oblong)
page('*', notFound)
page.start()
