import url from 'url'
import * as cheerio from 'cheerio'
import axios from 'axios'
import { EventEmitter } from 'events'
import { snakeCase } from 'snake-case'
import { Repository } from '../../repository/repository'
import { reit, stocks } from '@prisma/client'

enum TypeSecurities {
  STOCKS = 'STOCKS',
  REIT = 'REIT',
}

export class Fundaments {
  private baseUrl = 'https://www.fundamentus.com.br'
  private eventEmitter: EventEmitter

  constructor(private repository: Repository) {
    this.eventEmitter = new EventEmitter()
    this.eventEmitter.on('completeInformation', this.getSecuritiesDetails)
  }

  private _getSecuritiesDetails = async (securities: string) => {
    const { papel, type } = JSON.parse(securities)
    if (papel !== null && papel.length > 0) {
      setTimeout(async () => {
        try {
          const resource = `${this.baseUrl}/detalhes.php?papel=${papel}`
          const response = await axios.post(resource, null, {
            responseType: 'arraybuffer',
          })
          const htmlContent = cheerio.load(response.data.toString('latin1'))
          const data = await this.getFieldValueSecurities(htmlContent, type)

          const final: stocks | reit | any = {
            tipo_papel: type,
          }

          const finalFields = new Map()
          const field = {
            nome: '',
            nome_snake: '',
            descricao: '',
            tipo_papel: type,
          }

          // tratar melhor os dados vindos de data...
          // biome-ignore lint/complexity/noForEach: <explanation>
          data.fieldValues.forEach(element => {
            if (element.field === 'fii') {
              element.field = 'papel'
            }

            const fieldSnakeCase = snakeCase(
              element.field.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            )

            field.nome = element.field
            field.nome_snake = fieldSnakeCase
            field.descricao = element.fieldDescription

            finalFields.set(fieldSnakeCase, { ...field })
            final[fieldSnakeCase] = element.fieldValue
          })
          for (const [_, element] of finalFields) {
            await this.repository.createField(element)
          }

          if (final.tipo_papel === 'STOCKS') {
            await this.repository.createStock({ ...final })
          }

          if (final.tipo_papel === 'REIT') {
            await this.repository.createReit({ ...final })
          }

          // await addToQueue(
          //   'add',
          //   JSON.stringify({
          //     ...final,
          //   })
          // )
        } catch (error) {
          // console.error(error)
        }
      }, 2000)
    } else {
      console.error(securities)
    }
  }
  public get getSecuritiesDetails() {
    return this._getSecuritiesDetails
  }
  public set getSecuritiesDetails(value) {
    this._getSecuritiesDetails = value
  }

  getData = async (): Promise<any> => {
    const [listReits, listStocks] = await Promise.all([
      this.getContentREITs(),
      this.getContentStocks(),
    ])
    const securitiesJson = JSON.stringify([...listReits, ...listStocks])
    return securitiesJson
  }

  private getContentStocks = async (): Promise<any> => {
    const params = new url.URLSearchParams([
      ['ordem', '1'],
      // ['negociada', 'ON'],
    ])
    const resource = `${this.baseUrl}/resultado.php`
    const response = await axios.post(resource, params.toString(), {
      responseType: 'arraybuffer',
    })
    return this.parseContent(
      response.data.toString('latin1'),
      TypeSecurities.STOCKS
    )
  }

  private getContentREITs = async (): Promise<any> => {
    const url = `${this.baseUrl}/fii_resultado.php`
    const response = await axios.post(url, null, {
      responseType: 'arraybuffer',
    })
    return this.parseContent(
      response.data.toString('latin1'),
      TypeSecurities.REIT
    )
  }

  private parseContent = async (
    content: string,
    typeSecurities: TypeSecurities
  ): Promise<any> => {
    const htmlContent = cheerio.load(content)
    const headersList = this.getHeadersFromContent(htmlContent)
    const listSecurities = this.getDataFromContent(
      htmlContent,
      headersList,
      typeSecurities
    )
    return listSecurities
  }

  private getHeadersFromContent = (html: cheerio.CheerioAPI) => {
    const headersList: any = []
    const headers = html('table > thead > tr > th')
    headers.each(function () {
      const title = html(this).text().toLowerCase()
      headersList.push(title)
    })
    return headersList
  }

  private getDataFromContent = async (
    html: cheerio.CheerioAPI,
    headersList: any[],
    typeSecurities: TypeSecurities
  ) => {
    const listSecurities: any = []
    const contentTable = html('table > tbody > tr')
    contentTable.each((_, element) => {
      const bodyTable = html(element)
      const stock = {
        papel: '',
        cotação: '',
        type: typeSecurities,
        updated_at: new Date(),
      }
      bodyTable.find('td').each((i, element) => {
        stock[headersList[i]] = html(element).text()
      })

      this.eventEmitter.emit(
        'completeInformation',
        JSON.stringify(stock),
        typeSecurities
      )
      listSecurities.push(stock)
    })
    // const r = await addToQueue(
    //   'summary',
    //   JSON.stringify({
    //     type: typeSecurities,
    //     count: listSecurities.length,
    //   })
    // )
    return listSecurities
  }

  // Refatorar
  getFieldValueSecurities = async (
    html: cheerio.CheerioAPI,
    type: string
  ): Promise<any> => {
    const listFieldValues = new Array<DetailInfo>()
    const contentTable = html('table > tbody > tr ')
    const isHeader = text => {
      return (
        text === 'Oscilações' ||
        text === 'Indicadores fundamentalistas' ||
        text === 'Indicadores' ||
        text === 'Resultado' ||
        text === 'Dados Balanço Patrimonial' ||
        text === 'Balanço Patrimonial' ||
        text === 'Dados demonstrativos de resultados' ||
        text === 'Composição dos ativos' ||
        text === 'Pesquisar Documentos' ||
        text === 'Imóveis' ||
        text === 'Últimos 12 meses' ||
        text === 'Últimos 3 meses'
      )
    }

    contentTable.each((j, element) => {
      const bodyTable = html(element)
      bodyTable.find('td').each((i, element) => {
        const span = html(element).find('span')
        const isField = i % 2 === 0
        const isValue = !isField
        const mainInformation = j <= 6
        const isHeaders = isHeader(span.text())
        const isIndicadorFundamentalista = j >= 7 && j <= 18
        const isDadosDemonstrativos = j >= 20 && j <= 22
        const resutReit = j >= 13 && j <= 16
        const resutReit2 = j >= 22
        const resut = j >= 24
        const isData =
          mainInformation ||
          isIndicadorFundamentalista ||
          isDadosDemonstrativos ||
          resut ||
          resutReit2

        if (isHeaders) {
          return
        }

        // if (type === 'REIT' && resut) {
        //   console.log(j, i, span.text());
        // }

        if (isData && isField) {
          const fieldDescription = span.prop('title')
          let field = span.text().replace('?', '')

          if (resut && type === 'STOCKS' && i === 0) {
            field = field.concat(' 12m')
          }
          if (resut && type === 'STOCKS' && i === 2) {
            field = field.concat(' 3m')
          }

          if (resutReit && type === 'REIT' && i === 2) {
            field = field.concat(' 12m')
          }
          if (resutReit && type === 'REIT' && i === 4) {
            field = field.concat(' 3m')
          }
          listFieldValues.push({ fieldDescription, field })
        }

        if (isData && isValue) {
          const fieldValue = span.text().replace('\n', '')
          const prevData = {
            ...listFieldValues[listFieldValues.length - 1],
            fieldValue,
          }
          listFieldValues[listFieldValues.length - 1] = prevData
        }
      })
    })

    return this.parseFieldValue(listFieldValues)
  }

  parseFieldValue(listFieldValues: DetailInfo[]): {
    fieldValues: Array<DetailInfo>
    variation: Array<Variation>
  } {
    const variation: Array<Variation> = listFieldValues
      .flatMap(item => !item.fieldDescription && item)
      .map(item => {
        if (!item) return item
        const { field, fieldValue } = item
        if (field.length > 0) {
          return { field, fieldValue }
        }
      })
      .filter(item => item !== false && item !== undefined)

    const fieldValues = listFieldValues
      .flatMap(item => (item.fieldDescription !== undefined ? item : null))
      .filter(item => item !== null)

    return { fieldValues, variation }
  }
}
