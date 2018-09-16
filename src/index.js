// async polyfill
import 'regenerator-runtime/runtime'
import page from 'page'

async function mountains () {
  const { default: main } = await import('./mountains.js')
  main()
}

async function oblong () {
  const { default: main } = await import('./oblong.js')
  main()
}

const index = mountains

page('/', index)
page('/mountains', mountains)
page('/oblong', oblong)
page.start()
