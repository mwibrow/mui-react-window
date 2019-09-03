import clsx from "clsx"
import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/styles";

import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";

import { Scrollbars } from "react-custom-scrollbars";

import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";

import { appSelectors as selectors } from "../../store/reducers";
import { appSagas as sagas } from "../../store/sagas";

const styles = theme => ({
  root: {},
  body: {
    display: "flex",
  },
  cell: {
    alignItems: "center",
    boxSizing: "border-box",
    display: "flex",
  },
  cellHead: {},
  head: {},
  row: {
    display: "flex",
    flexDirection: "row",
  },
  rowHead: {},
});

const deferable = () => {
  let resolved, rejected;
  const promise = new Promise((resolve, reject) => {
    resolved = resolve;
    rejected = reject;
  });
  promise.resolve = resolved;
  promise.rejected = rejected;
  return promise;
};

const CustomScrollbars = ({ onScroll, forwardedRef, style, children }) => {
  const refSetter = useCallback(
    scrollbarsRef => {
      if (scrollbarsRef) {
        forwardedRef(scrollbarsRef.view);
      } else {
        forwardedRef(null);
      }
    },
    [forwardedRef]
  );

  return (
    <Scrollbars
      ref={refSetter}
      style={{ ...style, overflow: "hidden" }}
      onScroll={onScroll}
    >
      {children}
    </Scrollbars>
  );
};

const CustomScrollbarsVirtualList = React.forwardRef((props, ref) => (
  <CustomScrollbars {...props} forwardedRef={ref} />
));

class MuiVirtualizedTable extends React.Component {
  constructor(props) {
    super(props);
    this._defer = null;
  }

  componentDidMount() {
    const { loadNextPage } = this.props;
    loadNextPage();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return {
      moreItems: this.props.dataLength - prevProps.data.length > 0
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot.moreItems && this._defer) {
      this._defer.resolve();
    }
  }

  loadMoreData = () => {
    this._defer = deferable();
    const { loadNextPage } = this.props;
    loadNextPage();
    return this._defer;
  };

  renderRow = ({ index, style }) => {
    const { data, classes, columns } = this.props;
    if (index === data.length) {
      return (
        <TableRow
          className={classes.row}
          component="div"
          style={style}
        >
          <CircularProgress />
        </TableRow>
      );
    }
    const row = data[index];
    return (
      <TableRow
        className={classes.row}
        component="div"
        style={style}
      >
        {columns.map(column => this.renderCell(column, column.cell(row)))}
      </TableRow>
    );
  };

  renderCell(column, content, header) {
    const { classes } = this.props
    const { cellProps = {}, id, width } = column;
    const { style, ...otherProps } = cellProps;
    const cellStyle = {
      flexGrow: width ? 0 : 1,
      ...style
    };
    if (width) {
      cellStyle.width = cellStyle.width = cellStyle.maxWidth = cellStyle.flexBasis = width;
    }
    return (
      <TableCell
        className={clsx(classes.cell, {[classes.cellHead]: header})}
        component='div'
        key={id}
        style={cellStyle} {...otherProps}
      >
        {content}
      </TableCell>
    );
  }

  render() {
    const {
      data = [],
      classes,
      columns,
      loadingData,
      hasMoreData,
      rowHeight = 48
    } = this.props;
    const itemCount = hasMoreData ? data.length + 1 : data.length;
    const isItemLoaded = index => !hasMoreData || index < data.length;
    const loadMoreItems = loadingData ? () => {} : this.loadMoreData;

    return (
      <AutoSizer>
        {({ width, height }) => (
          <Table className={classes.root} component="div">
            <TableHead className={classes.head} component="div">
              <TableRow className={clsx(classes.row, classes.rowHead)} component="div">
                {columns.map(column => this.renderCell(column, column.header, true))}
              </TableRow>
            </TableHead>
            <TableBody
              className={classes.body}
              component="div"
              style={{
                width: width,
                height: height - rowHeight
              }}
            >
              <InfiniteLoader
                isItemLoaded={isItemLoaded}
                itemCount={itemCount}
                loadMoreItems={loadMoreItems}
              >
                {({ onItemsRendered, ref }) => (
                  <FixedSizeList
                    width={width}
                    height={height - rowHeight}
                    itemSize={rowHeight}
                    itemCount={itemCount - 1}
                    onItemsRendered={onItemsRendered}
                    outerElementType={CustomScrollbarsVirtualList}
                    ref={ref}
                  >
                    {this.renderRow}
                  </FixedSizeList>
                )}
              </InfiniteLoader>
            </TableBody>
          </Table>
        )}
      </AutoSizer>
    );
  }
}

MuiVirtualizedTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  rowHeight: PropTypes.number,
  hasMoreData: PropTypes.bool,
  loadingData: PropTypes.object,
  loadNextPage: PropTypes.func
};

const mapStateToProps = state => ({
  data: selectors.getData(state),
  hasMoreData: selectors.getHasMoreData(state),
  loadingData: selectors.getLoadingData(state)
});

const mapDispatchToProps = dispatch => ({
  loadNextPage: () => dispatch(sagas.fetchData())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(MuiVirtualizedTable));
