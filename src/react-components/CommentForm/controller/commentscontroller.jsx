import CausalityRedux from 'causality-redux';

//
// This example shows internal functions supported by causality-redux so
// that the model is not needed.
//

// user defined changer
const onAddComment2 = (comment = { author: '', text: '' }) => {
    return {
        type: 'onAddComment2',
        comment
    };
};

// user defined reducer
const onAddComment2Reducer = (state, action) =>
    Object.assign({}, state, {items: [...state.items, action.comment]});

// Comment state entry
export const COMMENTS_STATE = 'COMMENTS_STATE';
const reduxComments = {
    partitionName: COMMENTS_STATE,
    // No type checking of obj
    defaultState: { items: [], author: '', text: '', idToDelete: '', idToChange: '', authorToChange: '', nextIndex: '', obj: {} },
    changerDefinitions: {
        'onResetAuthorDefault': { operation: CausalityRedux.operations.STATE_SETTODEFAULTS, impliedArguments: ['author'] },
        'onAuthorChange': { arguments: ['author'] },
        'onTextChange': { arguments: ['text'] },
        'onObjectChange': { arguments: ['obj'] },
        'onIdChange': { arguments: ['idToDelete'] },
        'onIdChangeForChange': { arguments: ['idToChange'] },
        'onAuthorChangeForChange': { arguments: ['authorToChange'] },
        'onObjectMerge': { operation: CausalityRedux.operations.STATE_OBJECT_MERGE, arguments: ['obj'] },
        'onArrayChange': { arguments: ['items'] },
        'onAddComment': { operation: CausalityRedux.operations.STATE_ARRAY_ADD, arrayName: 'items', keyName: 'id', keyIndexerName: 'nextIndex', arrayArgShape: { author: 'String', text: 'String' } },
        'onChangeComment': { operation: CausalityRedux.operations.STATE_ARRAY_ENTRY_MERGE, arrayName: 'items', keyName: 'id', arrayArgShape: { author: 'String' } },
        'onDeleteComment': { operation: CausalityRedux.operations.STATE_ARRAY_DELETE, arrayName: 'items', keyName: 'id' },
        'onSetVideoUserDimensions': { operation: CausalityRedux.operations.STATE_ARRAY_ENTRY_MERGE, arrayName: 'items', keyName: 'id' }
    },
    changers: {
        onAddComment2
    },
    reducers: {
        onAddComment2Reducer
    }
};

// This establishes all the connections between the UI and business code.
// It also supports hot reloading for the business logic.
CausalityRedux.establishControllerConnections({
    module,
    partition: reduxComments
});

// Put in some initial comments.
if ( CausalityRedux.store[COMMENTS_STATE].getState().items.length === 0 ) {
    const initialComments = [
        {author: 'Cory Brown', text: 'My 2 scents'},
        {author: 'Jared Anderson', text: 'Let me put it this way. You`ve heard of Socrates? Aristotle? Plato? Morons!'},
        {author: 'Matt Poulson', text: 'It`s just a function!'},
        {author: 'Bruce Campbell', text: 'Fish in a tree? How can that be?'}
    ];

    initialComments.forEach(comment => CausalityRedux.store[COMMENTS_STATE].onAddComment(comment) );
}
