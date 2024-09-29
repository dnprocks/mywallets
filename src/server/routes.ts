import { type Request, type Response, Router } from 'express'

const router: Router = Router()

router.get('/ping', async (request: Request, response: Response) => {
  response.send('pong')
})

export { router }
