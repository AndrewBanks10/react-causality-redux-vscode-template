import CausalityRedux from 'causality-redux';
import { CounterForm_Partition } from '../CounterForm/controller';
import { CommentBox_Partition } from '../CommentForm/controller';
import MultiPartitionForm from './view';

const controllerUIConnections = [
    [
        MultiPartitionForm,    // React Component to wrap with redux connect
        // Used an array of objects to attach multiple partitions to the component's props 
        [
            { partitionName: CounterForm_Partition, changers: [], stateEntries: ['counter'] },
            { partitionName: CommentBox_Partition, changers: [], stateEntries: ['items']},
        ],
        'MultiPartitionForm'   // Name of the react component string form
    ]
];

const { partitionState, uiComponent } = CausalityRedux.establishControllerConnections({
    module,
    controllerUIConnections
});

export default uiComponent.MultiPartitionForm;