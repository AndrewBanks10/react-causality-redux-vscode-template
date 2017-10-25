import React from 'react';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import NavMenu from '../../react-components/NavMenu/controller';
import styles from './view.scss';
import counterstyles from '../../stylesheets/CounterForm';
import commentStyles from '../../stylesheets/CommentForm';

const Comment = ({ author, children }) =>
    <div className={commentStyles['comment-entry']}>
        <div className={commentStyles['comment-list-author']}>
            {author}
        </div>
        <div>
            {children}
        </div>
    </div>;

const MultiPartitionForm = ({ counter, items, onChange , text}) =>
    <div>
        <AppBar
            title='One react component has access to data and/or operations from multiple partitions.'
            iconElementLeft={<NavMenu useHome={'useHome'} />}
        />
        <Paper zDepth={4}>
            <div className={styles.TextTitle}>The counter value below is from the CounterForm_Partition.</div>    
            <div id='counter-text' className={counterstyles['counter-text']}>{`The current counter is ${counter}.`}</div>
            <p className={styles.TextTitle}>The list below is from the CommentBox_Partition.</p>    
            <div className={commentStyles['comment-form-list-container']}>
                <div className={commentStyles['comment-text']}>Comments</div>
                <div className={commentStyles['comment-form-list']}>
                    {items.map((comment) => 
                        <Comment author={comment.author} key={comment.id} >
                            {`id: ${comment.id}, ${comment.text}`}
                        </Comment>
                    )}
                </div>
            </div> 
        </Paper>    
    </div>;

export default MultiPartitionForm;



