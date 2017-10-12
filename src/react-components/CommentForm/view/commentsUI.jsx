import React from 'react';
import CausalityRedux from 'causality-redux';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import NavMenu from '../../../react-components/NavMenu/controller';
import RaisedButton from 'material-ui/RaisedButton';
import { COMMENTS_STATE } from '../controller/commentscontroller';
import TextField from 'material-ui/TextField';
import styles from '../../../stylesheets/CommentForm';

const Comment = ({ author, children }) =>
    <div className={styles['comment-entry']}>
        <div className={styles['comment-list-author']}>
            {author}
        </div>
        <div>
            {children}
        </div>
    </div>;


const CommentList = ({ items }) =>
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
const CommentListCausalityRedux = CausalityRedux.connectStateToProps(CommentList, COMMENTS_STATE, ['items'], 'React CommentList render');

class CommentForm extends React.Component {
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
                          onAuthorChange( '' ); 
                          onTextChange('');                          
                      }}
                >
                    <TextField
                        ref={(input) => { this.nameInput = input; }}         
                        hintText='Author'
                        required='required'
                        onChange={(e) => onAuthorChange(e.target.value)}
                        value={author}
                        style={{ width:'180px', marginRight:'10px'}}
                    />    
                    <TextField
                        hintText='Comment'
                        required='required'
                        onChange={(e) => onTextChange(e.target.value)}
                        value={text}
                        style={{ width:'180px', marginRight:'10px'}}
                    /> 
                    <RaisedButton type='submit' label='Post' />
    
                </form>
            </div>
        );
    }
}
const CommentFormCausalityRedux = CausalityRedux.connectChangersAndStateToProps(CommentForm, COMMENTS_STATE, ['onAddComment', 'onAuthorChange', 'onTextChange'], ['author', 'text'], 'React CommentForm render');

const CommentBoxDeleteForm = ({ onDeleteComment, onIdChange, idToDelete }) =>
    <div className={styles['comment-form-delete']}>
        <div className={styles['form-header']}>Delete Comment</div>
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onDeleteComment(idToDelete);
                onIdChange('');
            }}
        >
            <TextField
                hintText='ID to delete'
                required='required'
                onChange={(e) =>
                    onIdChange(e.target.value)}
                value={idToDelete}
                style={{ width:'100px'}}
            />    

            <RaisedButton className={styles['form-button']} type='submit' label='Delete' />
        </form>
    </div>;
const CommentBoxDeleteFormCausalityRedux = CausalityRedux.connectChangersAndStateToProps(CommentBoxDeleteForm, COMMENTS_STATE, ['onDeleteComment', 'onIdChange'], ['idToDelete'], 'React CommentBoxDeleteForm render');

const CommentBoxChangeForm = ({ onChangeComment, onIdChangeForChange, onAuthorChangeForChange, idToChange, authorToChange }) =>
    <div className={styles['comment-form-change']}>
        <div className={styles['form-header']}>Change the Author in a Comment</div>
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onChangeComment(idToChange, { author: authorToChange });
                onIdChangeForChange('');
                onAuthorChangeForChange('');
            }}
        >
            <TextField
                hintText='ID to change'
                required='required'
                onChange={(e) =>
                    onIdChangeForChange(e.target.value)}
                value={idToChange}
                style={{ width:'100px', marginRight:'10px'}}
            />
            <TextField
                hintText='Author'
                required='required'
                onChange={(e) => onAuthorChangeForChange(e.target.value)}
                value={authorToChange}
                style={{ width:'180px', marginRight:'10px'}}
            />  
            <RaisedButton type='submit' label='Change' />
        </form>
    </div>;
const CommentBoxChangeFormCausalityRedux = CausalityRedux.connectChangersAndStateToProps(CommentBoxChangeForm, COMMENTS_STATE, ['onChangeComment', 'onIdChangeForChange', 'onAuthorChangeForChange'], ['idToChange', 'authorToChange'], 'React CommentBoxChangeForm render');

const CommentBox = () =>
    <div>
        <AppBar
            title='Comments Demo'
            iconElementLeft={<NavMenu useHome={'useHome'}/>}
        />
        <Paper zDepth={4}>
            <CommentListCausalityRedux />
            <CommentFormCausalityRedux />
            <CommentBoxDeleteFormCausalityRedux />
            <CommentBoxChangeFormCausalityRedux />
        </Paper>    
    </div>;

export default CommentBox;

