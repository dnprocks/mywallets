import { App } from './server/app'

new App().server.listen(3000, () => {
  console.log('listen at 3000')
})
