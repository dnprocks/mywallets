import {
  type fields,
  PrismaClient,
  type reit,
  type stocks,
} from '@prisma/client'

export enum TypeSecurities {
  STOCKS = 'STOCKS',
  REIT = 'REIT',
}

const prisma = new PrismaClient()

export class Repository {
  createReit = async (securities: reit): Promise<any> => {
    const result = await prisma.reit.upsert({
      where: {
        papel: securities.fii,
      },
      create: { papel: securities.fii, ...securities },
      update: { papel: securities.fii, ...securities },
    })
    return result
  }

  createStock = async (securities: stocks): Promise<any> => {
    const result = await prisma.stocks.upsert({
      where: {
        papel: securities.papel,
      },
      create: { ...securities },
      update: { ...securities },
    })
    return result
  }

  createField = async (field: fields): Promise<any> => {
    // const result = await prisma.fields.create({
    //   data: { ...field },
    // })

    const result = await prisma.fields.upsert({
      where: {
        nome_snake: field.nome_snake,
        tipo_papel: field.tipo_papel,
      },
      create: { ...field },
      update: {}, // ...field
    })
    // console.log(result)
    return result
  }

  findOne = async (securities: stocks | reit): Promise<any> => {
    if (securities.tipo_papel === TypeSecurities.STOCKS) {
      return await prisma.stocks.findMany()
    }
    return await prisma.reit.findMany()
  }

  findAll = async (securities): Promise<any> => {
    throw new Error('Method not implemented.')
  }
}
