import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/styles'

import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import InfiniteLoader from 'react-window-infinite-loader'

import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';

import { appSelectors as selectors } from '../../store/reducers'
import { appSagas as sagas } from '../../store/sagas'

const styles = theme => ({

})


const deferable = () => {
  let resolved, rejected
  const promise = new Promise((resolve, reject) => {
    resolved = resolve
    rejected = reject
  })
  promise.resolve = resolved
  promise.rejected = rejected
  return promise
}

const T = props => <Table component='div' {...props} />
const THead = props => <TableHead component='div' {...props} />
const TBody = props => <TableBody component='div' {...props} />
const TCell = props => <TableCell component='div' style={{display:'flex',flexGrow: 1}}{...props}/>
const TRow = props => {
  const { style, ...rest } = props
  const styles = {
    ...style,
    display: 'flex', flexDirection: 'row'
  }
return <TableRow component='div' style={styles} {...rest} />
}
class DataTable extends React.Component {


  constructor(props) {
    super(props)
    this._defer = null
  }

  componentDidMount () {
    const { loadNextPage } = this.props
    loadNextPage()
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return {
      moreItems: this.props.dataLength - prevProps.data.length > 0
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot.moreItems && this._defer) {
      this._defer.resolve()
    }
  }

  loadMoreData = () => {
    this._defer = deferable()
    const { loadNextPage } = this.props
    loadNextPage()
    return this._defer
  }

  renderRow = ({ index, style }) => {
    const { data, columns } = this.props
    if (index === data.length) {
      return (<TRow style={style}>
        <CircularProgress />
      </TRow>)
    }
    const row = data[index]
    return (
      <TRow style={style}>
         {columns.map(column => <TCell key={column.id}>{column.column(row)}</TCell>)}
      </TRow>)
  }

  render () {
    const { data = [], columns, loadingData, hasMoreData } = this.props
    const itemCount = hasMoreData ? data.length + 1 : data.length
    const isItemLoaded = index => !hasMoreData || index < data.length
    const loadMoreItems = loadingData ? () => {} : this.loadMoreData


    return (
      <T>
        <THead>
          <TRow>
            {columns.map(column => <TCell key={column.id}>{column.header}</TCell>)}
          </TRow>
        </THead>
        <TBody style={{ width: '100vw', height: '90vh'}}>
      <AutoSizer>
        {({width, height}) => {
          console.log({width, height})
          return (
        <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
          <FixedSizeList
            width={width}
            height={height}
                itemSize={48}
                itemCount={itemCount - 1}
                onItemsRendered={onItemsRendered}
                ref={ref}>
                {this.renderRow}
                </FixedSizeList>
          )}
          </InfiniteLoader>
        )}}
        </AutoSizer>
        </TBody>
      </T>
    )
  }
}

Table.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  hasMoreData: PropTypes.bool,
  loadingData: PropTypes.object,
  loadNextPage: PropTypes.func,
}

const mapStateToProps = state => ({
  data: selectors.getData(state),
  hasMoreData: selectors.getHasMoreData(state),
  loadingData: selectors.getLoadingData(state),
})

const mapDispatchToProps = dispatch => ({
  loadNextPage: () => dispatch(sagas.fetchData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(DataTable)
)