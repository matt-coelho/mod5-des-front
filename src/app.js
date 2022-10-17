const ano_select = document.querySelector("#ano")
const lista = document.querySelector("#lista")
const baseURL = `http://localhost:3001/`
let anos = []
let times = []
let dados_ano = {}

function dados_anos() {
  let anos_options = ``
  let sanos = 0
  for (let ano = 2003; ano <= 2015; ano++) {
    anos.push(ano)
    if (sanos > 0) {
      anos_options += `<option value='${ano.toString()}'>${ano.toString()}</option>`
    } else {
      anos_options += `<option value='${ano.toString()}' selected>${ano.toString()}</option>`
    }
    sanos++
  }
  ano_select.insertAdjacentHTML("afterbegin", anos_options)
}

async function loadCatalog(url) {
  const dados = await fetch(`${url}`)
  if (dados.ok) {
    const dadosJSON = await dados.json()
    return dadosJSON
  }
}

async function reload() {
  const loadURL = `${baseURL}${ano_select.value}`
  const y = await loadCatalog(loadURL)
  if (y) {
    dados_ano = y
  }
}

;(async () => {
  dados_anos()
  await reload()
  carrega_dados_partidas()
})()

function carrega_dados_partidas() {
  const { partidas, numero } = dados_ano[dados_ano.length - 1]
  partidas.map((partida) => {
    const mandante = partida.mandante
    const timemandante = times.find((t) => t.nome == mandante)

    if (timemandante) {
      const { pontuacao_geral_mandante } = partida
      timemandante.gols_feitos = pontuacao_geral_mandante.total_gols_marcados
      timemandante.gols_sofridos = pontuacao_geral_mandante.total_gols_sofridos
      timemandante.empates = pontuacao_geral_mandante.total_empates
      timemandante.vitorias = pontuacao_geral_mandante.total_vitorias
      timemandante.derrotas = pontuacao_geral_mandante.total_derrotas
      timemandante.jogos = pontuacao_geral_mandante.total_jogos
      timemandante.pontos = pontuacao_geral_mandante.total_pontos
    } else {
      const { pontuacao_geral_mandante } = partida
      const time = {
        nome: mandante,
        gols_feitos: pontuacao_geral_mandante.total_gols_marcados,
        gols_sofridos: pontuacao_geral_mandante.total_gols_sofridos,
        empates: pontuacao_geral_mandante.total_empates,
        vitorias: pontuacao_geral_mandante.total_vitorias,
        derrotas: pontuacao_geral_mandante.total_derrotas,
        jogos: pontuacao_geral_mandante.total_jogos,
        pontos: pontuacao_geral_mandante.total_pontos,
      }
      times.push(time)
    }

    const visitante = partida.visitante
    const timevisitante = times.find((t) => t.nome == visitante)

    if (timevisitante) {
      const { pontuacao_geral_visitante } = partida
      timevisitante.gols_feitos = pontuacao_geral_visitante.total_gols_marcados
      timevisitante.gols_sofridos =
        pontuacao_geral_visitante.total_gols_sofridos
      timevisitante.empates = pontuacao_geral_visitante.total_empates
      timevisitante.vitorias = pontuacao_geral_visitante.total_vitorias
      timevisitante.derrotas = pontuacao_geral_visitante.total_derrotas
      timevisitante.jogos = pontuacao_geral_visitante.total_jogos
      timemandante.pontos = pontuacao_geral_visitante.total_pontos
    } else {
      const { pontuacao_geral_visitante } = partida
      const time = {
        nome: visitante,
        gols_feitos: pontuacao_geral_visitante.total_gols_marcados,
        gols_sofridos: pontuacao_geral_visitante.total_gols_sofridos,
        empates: pontuacao_geral_visitante.total_empates,
        vitorias: pontuacao_geral_visitante.total_vitorias,
        derrotas: pontuacao_geral_visitante.total_derrotas,
        jogos: pontuacao_geral_visitante.total_jogos,
        pontos: pontuacao_geral_visitante.total_pontos,
      }
      times.push(time)
    }
  })
  showLista()
}

ano_select.addEventListener("change", async (evt) => {
  evt.preventDefault()
  times.length = 0
  await reload()
  carrega_dados_partidas()
})

function sort_times() {
  times.sort((ta, tb) => {
    if (ta.pontos > tb.pontos) {
      return -1
    } else if (ta.pontos < tb.pontos) {
      return 1
    } else {
      return 0
    }
  })
}

function showLista() {
  const element = document.querySelector("#tabela")
  let lista_table = `<div id='tabela'>
    <table class="table table-striped table-bordered">
    <thead class="thead-dark">
    <tr>
      <th scope="col">${ano_select.value}</th>
      <th scope="col">Colocação</th>
      <th scope="col">Time</th>
      <th scope="col">P</th>
      <th scope="col">GP</th>
      <th scope="col">GC</th>
      <th scope="col">SG</th>
      <th scope="col">J</th>
      <th scope="col">E</th>
      <th scope="col">V</th>
      <th scope="col">D</th>
    </tr>
    </thead>
    `
  sort_times()

  let classRow = 0
  let rowClass = ""
  let colocacao = 1
  times.map((time) => {
    if (classRow < 4) {
      rowClass = "table-success"
    } else if (classRow >= times.length - 4) {
      rowClass = "table-warning"
    } else {
      rowClass = "table-light"
    }

    lista_table += `
    <tr class=${rowClass}>
      <td>
        <img src="img/${cleanName(time.nome.toLowerCase())}.png" alt="escudo ${
      time.nome
    }" width="30" height="30" />
      </td>
      <td>${colocacao}°</td>
      <td>${time.nome}</td>
      <td>${time.pontos}</td>
      <td>${time.gols_feitos}</td>
      <td>${time.gols_sofridos}</td>
      <td>${time.gols_feitos - time.gols_sofridos}</td>
      <td>${time.jogos}</td>
      <td>${time.empates}</td>
      <td>${time.vitorias}</td>
      <td>${time.derrotas}</td>
    </tr>
    `
    classRow += 1
    colocacao += 1
  })
  lista_table += "</table></div>"
  if (element) {
    lista.removeChild(element)
  }
  lista.insertAdjacentHTML("afterbegin", lista_table)
}

function cleanName(name) {
  const r = ["ê", "ó", "ú", "é", "ã", " ", "á", "í"]
  const s = ["e", "o", "u", "e", "a", "_", "a", "i"]
  for (letter of r) {
    if (name.includes(letter)) {
      const i = r.indexOf(letter)
      name = name.replace(letter, s[i])
    }
  }
  return name
}
