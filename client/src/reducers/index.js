/**
 * Created by Xingyu on 5/25/2017.
 */
import {combineReducers} from 'redux';
import FieldReducer from '../fields/reducers/reducer-fields';
import FieldActionReducer from '../fields/reducers/reducer-fields-actions';
import TaskReducer from '../tasks/reducers/';
import FieldTaskReducer from '../fields/reducers/FieldTasksReducer';

const allReducers = combineReducers({
    fields : FieldReducer,
    selectedField : FieldActionReducer,
    tasks : TaskReducer,
    fieldTasks : FieldTaskReducer

});

export default allReducers;