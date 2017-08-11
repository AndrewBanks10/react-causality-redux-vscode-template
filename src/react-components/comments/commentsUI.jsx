import React from 'react';
import CausalityRedux from 'causality-redux';
import { COMMENTS_STATE } from './commentscontroller';
import styles from '../../stylesheets/comments';

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
                    <input type="text"
                        ref={(input) => { this.nameInput = input; }} 
                        name="author"
                        required="required"
                        placeholder="Author"
                        value={author}
                        onChange={(e) => 
                               onAuthorChange(e.target.value)}
                    />
                    <input type="text"
                        name="text"
                        placeholder="Comment"
                        required="required"                           
                        value={text}
                        onChange={e => onTextChange(e.target.value)}
                    />
                    <button className={styles['form-button']}>Post</button>
     
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
            <input type="text"
                name="ID"
                required="required"
                value={idToDelete}
                placeholder="ID to delete"
                onChange={(e) =>
                    onIdChange(e.target.value)}
            />
            <button className={styles['form-button']}>Delete</button>
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
            <input type="text"
                name="ID"
                required="required"
                value={idToChange}
                placeholder="ID of entry"
                onChange={(e) =>
                    onIdChangeForChange(e.target.value)}
            />
            <input type="text"
                name="author"
                required="required"
                value={authorToChange}
                placeholder="Author"
                onChange={(e) =>
                    onAuthorChangeForChange(e.target.value)}
            />
            <button className={styles['form-button']}>Change</button>
        </form>
    </div>;
const CommentBoxChangeFormCausalityRedux = CausalityRedux.connectChangersAndStateToProps(CommentBoxChangeForm, COMMENTS_STATE, ['onChangeComment', 'onIdChangeForChange', 'onAuthorChangeForChange'], ['idToChange', 'authorToChange'], 'React CommentBoxChangeForm render');

const CommentBox = () =>
    <div>
        <CommentListCausalityRedux />
        <CommentFormCausalityRedux />
        <CommentBoxDeleteFormCausalityRedux />
        <CommentBoxChangeFormCausalityRedux />
    </div>;

export default CommentBox;

