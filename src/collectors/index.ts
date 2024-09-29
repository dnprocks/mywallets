import { Repository } from '../repository/repository'
import { Fundaments } from './fundamentus/fundaments'

const database = new Repository()
const fundaments = new Fundaments(database)
;(async () => {
  await fundaments.getData()
})()
