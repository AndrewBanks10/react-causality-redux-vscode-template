import React from 'react';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import NavMenu from '../../react-components/NavMenu/controller';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import styles from '../../stylesheets/CommentForm';

const wideTextFieldStyle = { width: '180px', marginRight: '10px' };
const shortTextFieldStyle = { width: '100px', marginRight: '10px' };

const Comment = ({ author, children }) =>
    <div className={styles['comment-entry']}>
        <div className={styles['comment-list-author']}>
            {author}
        </div>
        <div>
            {children}
        </div>
    </div>;

export const CommentList = ({ items }) =>
    <div className={styles['comment-form-list-container']}>
        <div className={styles['comment-text']}>Comments</div>
        <div className={styles['comment-form-list']}>
            {items.map((comment) => 
                <Comment author={comment.author} key={comment.id} >
                    {`id: ${comment.id}, ${comment.text}`}
                </Comment>
            )}
        </div>
    </div>;             

export class CommentForm extends React.Component {
    componentDidMount(){
      this.nameInput.focus();
    }
    render() {
        const {onAddComment, onAuthorChange, onTextChange, author, text } = this.props;
        return(
            <div className={styles['comment-form-delete']}>
                <div className={styles['form-header']}>Add Comment</div>
                <form 
                    onSubmit={(e) => {
                          e.preventDefault();
                          onAddComment({author, text});
                      }}
                >
                    <TextField
                        ref={(input) => { this.nameInput = input; }}         
                        hintText='Author'
                        required='required'
                        onChange={(e) => onAuthorChange(e.target.value)}
                        value={author}
                        style={wideTextFieldStyle}
                    />    
                    <TextField
                        hintText='Comment'
                        required='required'
                        onChange={(e) => onTextChange(e.target.value)}
                        value={text}
                        style={wideTextFieldStyle}
                    /> 
                    <RaisedButton type='submit' label='Post' />
    
                </form>
            </div>
        );
    }
}

export const CommentBoxDeleteForm = ({ onDeleteComment, onIdChange, idToDelete }) =>
    <div className={styles['comment-form-delete']}>
        <div className={styles['form-header']}>Delete Comment</div>
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onDeleteComment();
            }}
        >
            <TextField
                hintText='ID to delete'
                required='required'
                onChange={(e) =>
                    onIdChange(e.target.value)}
                value={idToDelete}
                style={shortTextFieldStyle}
            />    

            <RaisedButton className={styles['form-button']} type='submit' label='Delete' />
        </form>
    </div>;

export const CommentBoxChangeForm = ({ onChangeComment, onIdChangeForChange, onAuthorChangeForChange, idToChange, authorToChange }) =>
    <div className={styles['comment-form-change']}>
        <div className={styles['form-header']}>Change the Author in a Comment</div>
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onChangeComment(idToChange, { author: authorToChange });
            }}
        >
            <TextField
                hintText='ID to change'
                required='required'
                onChange={(e) =>
                    onIdChangeForChange(e.target.value)}
                value={idToChange}
                style={shortTextFieldStyle}
            />
            <TextField
                hintText='Author'
                required='required'
                onChange={(e) => onAuthorChangeForChange(e.target.value)}
                value={authorToChange}
                style={wideTextFieldStyle}
            />  
            <RaisedButton type='submit' label='Change' />
        </form>
    </div>;

export const CommentBox = ({ CommentList, CommentForm, CommentBoxDeleteForm, CommentBoxChangeForm }) =>
    <div>
        <AppBar
            title='Comments Demo'
            iconElementLeft={<NavMenu useHome={'useHome'}/>}
        />
        <Paper zDepth={4}>
            <CommentList />
            <CommentForm />
            <CommentBoxDeleteForm />
            <CommentBoxChangeForm />
        </Paper>    
    </div>;



