const _ = require('lodash')

function mapper (mapping) {
  const mappingEntries = _(mapping)
  .omitBy(_.isArray)
  .entries()
  .map(([name, fx]) => [name, fx, _.isFunction(fx)])
  .value()

  const extras = _.pickBy(mapping, _.isArray)

  function mapItem (item) {
    const res = {}

    // optimized for performance (this code is potentially run on large datasets)
    for (const [name, fx, isFun] of mappingEntries) {
      const value = isFun ? fx(item) : item[fx]

      // ignore undefined values
      if (value !== undefined) {
        res[name] = value
      }
    }

    return res
  }

  function map (data) {
    if (!data) return null
    return _.isArray(data) ? data.map(mapItem) : mapItem(data)
  }

  map.loading = (includes, opts) => async data => {
    if (!data) return null

    const raw = _.castArray(data)
    const mapped = raw.map(mapItem)
    const getColumn = _.memoize(col => raw.map(r => r[col]))

    await Promise.all(_.map(includes, (inc, name) => {
      if (!inc) return null

      const [keyCol, resolver, _inc] = _.isArray(inc) ? inc : extras[name]

      return resolver(getColumn(keyCol), opts, _.isArray(inc) ? _inc : inc)
      .then(values => values.forEach((val, i) => {
        mapped[i][name] = val
      }))
    }))

    return _.isArray(data) ? mapped : mapped[0]
  }

  map.mapping = { ...mapping }
  return map
}

module.exports = {
  mapper,
  dbMapper: obj => _.mapKeys(obj, (key, value) => `:${value}`),
}
