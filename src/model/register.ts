export interface RegField {
  bits: number[]
  name: string
  description: string
  access: string
  reset: string
}

export interface Register {
  id: string
  name: string
  description: string
  offset: number
  fields: Array<RegField>
  parent: string
}