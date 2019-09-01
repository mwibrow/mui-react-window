
const generateData = (index = 0, pageSize = 50) => {
  const data = []
  for (let i = index; i < index + pageSize; i ++) {
    let row = {}
    for (let j = 1; j < 10; j ++) {
      row[`column${j}`] = `data-${i}-${j}`
    }
    data.push(row)
  }
  return { data, hasMoreData: index + pageSize < 400 }
}

const fetchData = async ({ index, pageSize = 50}) => {
  return generateData(index, pageSize)
}

export {
  fetchData,
}