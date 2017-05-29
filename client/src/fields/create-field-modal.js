/**
 * Created by Xingyu on 5/25/2017.
 */
import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import {connect} from 'react-redux';
import {saveField} from './actions/save-field';
import styled from 'styled-components';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import LinearProgress from 'material-ui/LinearProgress';
import NewFieldMapComponent from './maps/NewFieldMapComponent.jsx'

//STATIC STYLES - [TODO: CONSOLIDATE STYLINGS]
const NewFieldMap = styled.div`
        height: 450px;
`;

const styles = {
    block: {
        maxWidth: 250,
    },
    radioButton: {
        marginBottom: 16,
    },
};

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
class CreateFieldModal extends Component {
    /**
     * Class constructor.
     */
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            errors: {},
            open: false,
            validated: false,
            loading: false,
            done: false,
            markers: [{
                position: {
                    lat: 49.249683,
                    lng: -123.237421,
                },
                key: `UBCFarm`,
                defaultAnimation: 2,
            }],
            polygon: []
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleMapLoad = this.handleMapLoad.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);
        this.handleMarkerRightClick = this.handleMarkerRightClick.bind(this);
        this.handleOverlayComplete = this.handleOverlayComplete.bind(this);
        this.handlePolygonEdit = this.handlePolygonEdit.bind(this);
    };

    handleOpen(){
        this.setState({open: true});
    };

    handleClose(){
        this.setState({open: false});
    };
    handleChange(e){
        if(this.state.errors[e.target.name]){
            console.log("handle error fired");
            let errors = Object.assign({}, this.state.errors);
            delete errors[e.target.name];
            this.setState({
                [e.target.name]: e.target.value,
                errors,
            });
        }else{
            this.setState({
                [e.target.name]: e.target.value,
            });

        }

    };
    handleSubmit(e){
        e.preventDefault();

        //validation
        let errors = {};
        if(this.state.name === '')
            errors.name = "This field is Required";
        this.setState({errors});

        //if valid, create post request
        const isValid = Object.keys(errors).length === 0;
        if(isValid){
            const{name} = this.state;
            this.setState({loading: true});
            this.props.saveField({name}).then(
                () => {this.setState({done: true})},
                (err) => err.response.json().then(({errors}) => this.setState({ errors, loading: false}))
            );
        }

    };

    //Map functions
    handleMapLoad(map) {
        this._mapComponent = map;
        if (map) {
            //console.log(map.getZoom());
            // map.event.addListener(drawingManager, 'overlaycomplete', function(event) {
            //     if (event.type == 'polygon') {
            //         console.log("polygon drawn!");
            //     }
            // });
        }
    }

    /*
     * This is called when you click on the map.
     * Go and try click now.
     */
    handleMapClick(event) {
        const nextMarkers = [
            ...this.state.markers,
            {
                position: event.latLng,
                defaultAnimation: 2,
                key: Date.now(), // Add a key property for: http://fb.me/react-warning-keys
            },
        ];
        this.setState({
            markers: nextMarkers,
        });

        if (nextMarkers.length === 3) {

        }
    }

    handleMarkerRightClick(targetMarker) {
        /*
         * All you modify is data, and the view is driven by data.
         * This is so called data-driven-development. (And yes, it's now in
         * web front end and even with google maps API.)
         */
        const nextMarkers = this.state.markers.filter(marker => marker !== targetMarker);
        this.setState({
            markers: nextMarkers,
        });
    }

    handleOverlayComplete(evt){
        const type = evt.type; // "CIRCLE", "POLYGON", etc
        const overlay = evt.overlay; // regular Google maps API object
        let ref = this;

        // Use react-google-maps instead of the created overlay object
        // google.maps.event.clearInstanceListeners(overlay);
        // overlay.setMap(null);

        // Ok, now we can handle the event in a "controlled" way
        //this.props.doSomethingReactWithTheData(overlay);
        console.log(type);
        console.log(overlay);
        if (type == "polygon") {
            ref.setState({
                polygon: overlay.getPath().getArray()
            });

            //add listeners for editing the shape and updating React component accordingly
            google.maps.event.addListener(overlay.getPath(), 'set_at', function() {
                console.log("edited node");
                ref.setState({
                    polygon: overlay.getPath().getArray()
                });
            });

            google.maps.event.addListener(overlay.getPath(), 'insert_at', function() {
                console.log("added node");
                ref.setState({
                    polygon: overlay.getPath().getArray()
                });
            });
        }


        // ex:
        // let radius = overlay.getRadius();
        // let center = overlay.getCenter();
        // this.setState({ circles: [ ...this.state.circles, { radius, center }]});
    }

    handlePolygonEdit(evt){
        const type = evt.type;
        console.log(type);
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
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
            <div>
                <RaisedButton label="New Field" onTouchTap={this.handleOpen} />
                <Dialog
                    title="Create New Field"
                    actions={actions}
                    modal={true}
                    open={this.state.open}
                >
                    <div className="columns">
                        <NewFieldMap style={{margin: 0, padding: 0}} className="column is-9-desktop">
                            <div style={{height: `100%`}}>
                                <NewFieldMapComponent
                                    containerElement={
                                        <div style={{ height: `100%` }} />
                                    }
                                    mapElement={
                                        <div style={{ height: `100%` }} />
                                    }
                                    onMapLoad={this.handleMapLoad}
                                    onMapClick={this.handleMapClick}
                                    markers={this.state.markers}
                                    onMarkerRightClick={this.handleMarkerRightClick}
                                    onOverlayComplete={this.handleOverlayComplete}
                                    onPolygonEdit={this.handlePolygonEdit}
                                />
                            </div>
                        </NewFieldMap>
                        <div className="column is-3-desktop">
                            <form>
                                <RadioButtonGroup name="buildingOrField" defaultSelected="field">
                                    <RadioButton
                                        value="building"
                                        label="Building"
                                        style={styles.radioButton}
                                    />
                                    <RadioButton
                                        value="field"
                                        label="Field"
                                        style={styles.radioButton}
                                    />
                                </RadioButtonGroup>
                            </form>
                        </div>
                    </div>
                    <form>
                        <TextField
                            hintText="Enter Name for new Field"
                            floatingLabelText="Enter Name for new Field"
                            name="name"
                            onChange={this.handleChange}
                            value={this.state.name}
                            errorText={this.state.errors.name}/>

                    </form>
                    {!!this.state.errors.global && <p>this.state.errors.global</p>}
                </Dialog>
            </div>
        );

        return (
            <div>
                {this.state.done ? <Redirect to="/fields"/> : form}
            </div>

        );
    }
}

export default connect(null, {saveField})(CreateFieldModal);
