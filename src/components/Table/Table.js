import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import MonetizationOn from "@material-ui/icons/MonetizationOn";
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";

const useStyles = makeStyles(styles);

export default function CustomTable(props) {
  const classes = useStyles();
  const { tableHead, tableData, tableHeaderColor, tableAction, tableRowId } = props;
  
  function StandardCells({ row }) {
    return Object.values(row).map((value, i) => {
      if (i === 0) {
        return null;
      }

      return (
        // Index keys are acceptable here because columns are not going to be reordered
        // eslint-disable-next-line react/no-array-index-key
        <TableCell className={classes.tableCell}  key={i}>
          {value}
        </TableCell>
      );
    });
  }

  function AcctionCells({row}){
    return(
      <>
        <TableCell className={classes.tableActions} key="action">
        { tableAction[0] ? (
          <Tooltip
            id="tooltip-top"
            title="Editar"
            placement="top"
            classes={{ tooltip: classes.tooltip }}
          >
            <IconButton
              aria-label="Edit"
              className={classes.tableActionButton}
              onClick={() => tableAction[0](row)}
            >
              <Edit
                className={
                  classes.tableActionButtonIcon + " " + classes.edit
                }
              />
            </IconButton>
          </Tooltip>
          ) : (null) }
          { tableAction[1] ? (
          <Tooltip
            id="tooltip-top-start"
            title="Cancelar"
            placement="top"
            classes={{ tooltip: classes.tooltip }}
            onClick={() => tableAction[1](row)}
          >
            <IconButton
              aria-label="Close"
              className={classes.tableActionButton}
            >
              <Close
                className={
                  classes.tableActionButtonIcon + " " + classes.close
                }
              />
            </IconButton>
          </Tooltip>
          ) : (null) }
          { tableAction[2] ? (
          <Tooltip
            id="tooltip-top-start"
            title="Pagar"
            placement="top"
            classes={{ tooltip: classes.tooltip }}
            onClick={() => tableAction[2](row)}
          >
            <IconButton
              aria-label="Pay"
              className={classes.tableActionButton}
            >
              <MonetizationOn
                className={
                  classes.tableActionButtonIcon + " " + classes.pay
                }
              />
            </IconButton>
          </Tooltip>
          ) : (null) }
        </TableCell>
      </>
    );
  }

  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
            <TableRow className={classes.tableHeadRow}>
              {tableHead.map((prop, key) => {
                return (
                  <TableCell
                    className={classes.tableCell + " " + classes.tableHeadCell}
                    key={key}
                  >
                    {prop}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {tableData.map(row => {
            return (
              <TableRow key={row[tableRowId]} className={classes.tableBodyRow}>
                <StandardCells row={row} />
                {tableAction ? (
                <AcctionCells row={row} />
                ): null}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray"
};

CustomTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.object),
  tableAction: PropTypes.arrayOf(PropTypes.func),
  tableRowId: PropTypes.string,
  // editMethod: PropTypes.func,
  // removeMethod: PropTypes.func
};
