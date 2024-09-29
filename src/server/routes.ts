import { type Request, type Response, Router } from 'express'
import { Repository } from '../repository/repository'

const router: Router = Router()
const repository = new Repository()

router.get('/ping', async (request: Request, response: Response) => {
  response.send('pong')
})

router.get(
  '/stock/:securities',
  async (request: Request, response: Response) => {
    const { securities } = request.params
    const stock = await repository.findOne(securities)
    response.send(stock)
  }
)

router.get('/stock', async (req: Request, response: Response) => {
  const { type } = req.query
  const stocks = await repository.findAll(type?.toString())
  response.send(stocks)
})

// // TODO: Refatorar
router.post('/create', async (req: Request, response: Response) => {
  const { queue, body } = req.body
  console.log(queue)
  try {
    const json = JSON.parse(body)
    console.log(json.tipo_papel)
    if (json.tipo_papel === 'STOCKS') {
      const result = await repository.createStock({ ...json })
      return response.send(result)
    }

    if (json.tipo_papel === 'REIT') {
      const result = await repository.createReit({ ...json })
      return response.send(result)
    }
  } catch (error) {
    console.log(error)
  }
  return response.send({ ignored: true })
})

export { router }
