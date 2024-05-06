import { json } from "./middlewares/json.js"
import { rotas } from './routes.js'
import { extracao_query } from './utils/extracao_query.js'
import http from "node:http";

const servidor = http.createServer(async (req, res) => {
    const { method , url } = req

    await json(req, res)

    const rota = rotas.find(rota => {
        return rota.method === method && rota.path.test(url)
    })

    if(rota) {
        const ParametrosDaRota = req.url.match(rota.path)

        const { query, ...params } = ParametrosDaRota.groups

        req.params = params
        req.query = query ? extracao_query(query) : {}

        return rota.handler(req, res)

    }

    return res.writeHead(404).end("Algo deu errado server.js")

})

servidor.listen(6666)