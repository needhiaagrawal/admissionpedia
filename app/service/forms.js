import fieldsFixed from '../models/fieldsFixed'

export const getFieldsFixed = async () => {
  let list = await fieldsFixed.findAll({ raw: false })
  return list
}
