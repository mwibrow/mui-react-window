import React from "react";
import { withStyles } from "@material-ui/styles";
import { Paper, Typography } from "@material-ui/core";

import Table from "../table/Table";

const styles = theme => ({
  root: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    overflow: "hidden"
  }
});

class App extends React.Component {
  render() {
    const { classes } = this.props;
    const columns = [
      {
        id: "column1",
        cell: row => row.column1,
        width: 128,
        header: <Typography variant="caption">Column1</Typography>
      },
      {
        id: "column2",
        cell: row => row.column2,
        header: <Typography variant="caption">Column2</Typography>
      },
      {
        id: "column3",
        cell: row => row.column3,
        header: <Typography variant="caption">Column3</Typography>,
        width: 128
      }
    ];
    return (
      <Paper className={classes.root}>
        <Table columns={columns} />
      </Paper>
    );
  }
}

export default withStyles(styles)(App);
