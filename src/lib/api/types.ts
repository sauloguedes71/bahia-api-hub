export interface IbgeLocalidade {
  id: number
  nome: string
}

export interface BahiaTerritorio {
  municipios: number
  mesorregioes: number
  microrregioes: number
}

export interface Municipio {
  id: number
  nome: string
  microrregiao: string
  mesorregiao: string
}

export interface MunicipioStats {
  populacao: number | null
  areaKm2: number | null
  densidade: number | null
}

export interface MunicipioResumo {
  texto: string
  imagem: string | null
  url: string
}

export type Ponto = [number, number] // [longitude, latitude]
export type Ring = Ponto[]

export interface Contorno {
  rings: Ring[]
}