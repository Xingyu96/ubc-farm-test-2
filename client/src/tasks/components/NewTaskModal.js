/**
 * Created by Xingyu on 6/2/2017.
 */
import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider'
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField'

const styles = {};

const typeData = [
    {
        text: 'seeding',
        value: (
            <MenuItem
                primaryText="seeding"
                secondaryText="&#127793;"
            />
        ),
    },
    {
        text: 'irrigation',
        value: (
            <MenuItem
                primaryText="irrigation"
                secondaryText="&#128166;"
            />
        ),
    },
    {
        text: 'pest-control',
        value: (
            <MenuItem
                primaryText="pest-control"
                secondaryText="&#128028;"
            />
        ),
    },
    {
        text: 'transplanting',
        value: (
            <MenuItem
                primaryText="transplanting"
                secondaryText="&#127807;"
            />
        ),
    },
    {
        text: 'soil-sampling',
        value: (
            <MenuItem
                primaryText="soil-sampling"
                secondaryText="&#128300;"
            />
        ),
    },
    {
        text: 'scouting-harvest',
        value: (
            <MenuItem
                primaryText="scouting-harvest"
                secondaryText="&#128203;"
            />
        ),
    },
    {
        text: 'scouting-pests',
        value: (
            <MenuItem
                primaryText="scouting-pests"
                secondaryText="&#128204;"
            />
        ),
    },
    {
        text: 'fertilizing',
        value: (
            <MenuItem
                primaryText="fertilizing"
                secondaryText="&#128169;"
            />
        ),
    },

];

/**
 * Modal for creating new Task
 */
class CreateFieldModal extends Component {
    /**
     * Class constructor.
     */
    constructor(props) {
        super(props);

        this.state = {
            fieldsMenuData: [],
            name: '',
            errors: {},
            open: false,
            validated: false,
            loading: false,
            done: false,
            polygon: []
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createFieldsMenu = this.createFieldsMenu.bind(this);
    };

    componentDidMount() {
        this.state.fieldsMenuData = this.createFieldsMenu;
    }

    createFieldsMenu() {
        let data = this.props.fields.map((field) => {
            return {
                text: field.name,
                value: (
                    <MenuItem
                        key={field._id}
                        primaryText={field.name}
                    />
                ),
            }
        });
        console.log(data);
        return data;
    };

    handleOpen() {
        this.setState({open: true});
    };

    handleClose() {
        this.setState({open: false, name: ''});
    };

    handleChange(e) {
        if (this.state.errors[e.target.name]) {
            console.log("handle error fired");
            let errors = Object.assign({}, this.state.errors);
            delete errors[e.target.name];
            this.setState({
                [e.target.name]: e.target.value,
                errors,
            });
        } else {
            this.setState({
                [e.target.name]: e.target.value,
            });
        }
    };

    handleSubmit(e) {
        e.preventDefault();

        //validation
        let errors = {};
        if (this.state.name === '')
            errors.name = "This field is Required";
        this.setState({errors});

        //if valid, create post request
        const isValid = Object.keys(errors).length === 0;
        if (isValid) {
            const {name, polygon} = this.state;
            this.setState({loading: true});
            this.props.saveField({name, polygon}).then(
                (response) => {
                    console.log("should catch error here")
                }
            );
            this.setState({done: true, loading: false});
            this.handleClose();
        }
    };

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label={this.state.loading ? '' : "Submit"}
                primary={true}
                disabled={false}
                onTouchTap={this.handleSubmit}
                icon={this.state.loading ? <CircularProgress /> : ''}
            />,
        ];

        const form = (
            <div style={{minWidth: '100%', height: '100%'}}>
                <div style={{}}>
                    <FlatButton label="New Task" onTouchTap={this.handleOpen} labelStyle={{color: '#4CAF50'}}/>
                </div>
                <Dialog
                    title="Create New Task"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    contentStyle={{width:'100%'}}
                >
                    <form>
                        <div style={{marginBottom:'5px'}}>
                        <DatePicker
                            hintText="Portrait Inline Dialog"
                            container="inline"
                            fullWidth={true}
                        />
                        </div>
                        <div className="columns">
                            <div className="column">
                                <AutoComplete
                                    floatingLabelText="Field"
                                    filter={AutoComplete.caseInsensitiveFilter}
                                    dataSource={this.props.fieldsMenuData}
                                    openOnFocus={true}
                                    fullWidth={true}
                                />

                            </div>
                            <div className="column">
                                <AutoComplete
                                    floatingLabelText="Activity Type"
                                    filter={AutoComplete.caseInsensitiveFilter}
                                    dataSource={typeData}
                                    openOnFocus={true}
                                    fullWidth={true}
                                />


                            </div>

                        </div>
                        <TextField
                            hintText="MultiLine with rows: 2 and rowsMax: 4"
                            multiLine={true}
                            rows={5}
                            rowsMax={10}
                            floatingLabelText="Description"
                            textareaStyle={{ backgroundColor: '#EEEEEE'}}
                            fullWidth={true}
                        /><br />


                    </form>
                </Dialog>

            </div>
        );

        return (
            <div key={this.state.timestamp} style={{minWidth: '100%', height: '100%'}}>
                {form}
            </div>

        );
    }
}

CreateFieldModal.propTypes = {
    fieldsMenuData: PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
    return {
        fieldsMenuData: state.fields.map((field) => {
            return {
                text: field.name,
                value: (
                    <MenuItem
                        key={field._id}
                        primaryText={field.name}
                    />
                ),
            }
        })
    }
}

export default connect(mapStateToProps, {})(CreateFieldModal);
