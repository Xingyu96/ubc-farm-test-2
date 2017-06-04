/**
 * Created by Xingyu on 6/2/2017.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Table,
    TableBody,
    TableFooter,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import PropTypes from 'prop-types';

const styles = {
    propContainer: {
        width: 200,
        overflow: 'hidden',
        margin: '20px auto 0',
    },
    propToggleHeader: {
        margin: '20px auto 10px',
    },
};

let tableData = [];

/**
 * A more complex example, allowing the table height to be set, and key boolean properties to be toggled.
 */
class TaskList extends Component {
    constructor(props, context) {
        super(props, context);

        // set the initial component state
        this.state = {
            fixedHeader: true,
            fixedFooter: true,
            stripedRows: false,
            showRowHover: false,
            selectable: true,
            multiSelectable: false,
            enableSelectAll: false,
            deselectOnClickaway: true,
            showCheckboxes: true,
            height: '300px',
        };

        this.handleToggle = this.handleToggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }



    handleToggle(event, toggled){
        this.setState({
            [event.target.name]: toggled,
        });
    }

    handleChange(event){
        this.setState({height: event.target.value});
    }

    render() {
        return (
            <div>
                <Table
                    height={'500px'}
                    fixedHeader={true}
                    fixedFooter={false}
                    selectable={false}
                    multiSelectable={false}
                >
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                        enableSelectAll={false}
                        style={{verticalAlign: 'middle'}}
                    >

                        <TableRow>
                            <TableHeaderColumn tooltip="Sort by Type" style={{verticalAlign: 'middle'}}>Type</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Sort by Field" style={{verticalAlign: 'middle'}}>Field</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Sort by Start Date" style={{verticalAlign: 'middle'}}>Start Date</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Sort by End Date" style={{verticalAlign: 'middle'}}>End Date</TableHeaderColumn>

                        </TableRow>
                    </TableHeader>
                    <TableBody
                        displayRowCheckbox={false}
                        deselectOnClickaway={true}
                        showRowHover={true}
                        stripedRows={false}
                    >
                        {this.props.tasks.map( (task, index) => (
                            <TableRow key={index}>
                                <TableRowColumn style={{verticalAlign: 'middle'}}>{task.type}</TableRowColumn>
                                <TableRowColumn style={{verticalAlign: 'middle'}}>{task.field}</TableRowColumn>
                                <TableRowColumn style={{verticalAlign: 'middle'}}>{task.startDate}</TableRowColumn>
                                <TableRowColumn style={{verticalAlign: 'middle'}}>{task.endDate}</TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter
                        adjustForCheckbox={false}
                    >
                        <TableRow>
                            <TableRowColumn style={{verticalAlign: 'middle'}}>Type</TableRowColumn>
                            <TableRowColumn style={{verticalAlign: 'middle'}}>Field</TableRowColumn>
                            <TableRowColumn style={{verticalAlign: 'middle'}}>Start Date</TableRowColumn>
                            <TableRowColumn style={{verticalAlign: 'middle'}}>End Date</TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn colSpan="4" style={{textAlign: 'center'}}>
                                Super Footer
                            </TableRowColumn>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        );
    }
}

TaskList.propTypes = {
    tasks: PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
    return {
        tasks: state.tasks
    }
};

export default connect(mapStateToProps)(TaskList);