import React from 'react'
import { withStyles } from '@material-ui/styles'
import { Paper } from '@material-ui/core'

import Table from '../table/Table'

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
  }
})

class App extends React.Component {

  render () {
    const { classes } = this.props
    return (
      <Paper className={classes.root}>
        <Table />
      </Paper>

    )
  }
}

export default withStyles(styles)(App);
