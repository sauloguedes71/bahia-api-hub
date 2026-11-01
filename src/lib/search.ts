/** Remove acentos e ignora maiúsculas, para buscas que aceitam "educacao" e "Educação". */
export const normalize = (value: string): string =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()