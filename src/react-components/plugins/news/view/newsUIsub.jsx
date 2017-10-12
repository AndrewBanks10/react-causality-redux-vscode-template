import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import styles from './newsUI.scss';

const LoaderNews = ({isBusy}) => {
    let className = '';
    if ( isBusy )
        className = styles.loader;
    return (
        <div className={className} />
    );
};

const ErrorMessage = ({ errorMsg, clearError }) => {
    if (errorMsg === '')
        return null;
    return (
        <div className={styles['error-message']}>
            <div id='errorMessageEffect' className={styles['error-message-text']}> {errorMsg}</div>
            <br />
            <button onClick={() => clearError()}>OK</button>
        </div>
    );
};

const NewsContainer = ({ closeNews, newsObj }) => {
    const defaultWidth = 800;
    if (newsObj.news.length === 0) {
        document.body.style.overflow = 'auto';
        return null;
    }
    document.body.style.overflow = 'hidden';
    const tlist = newsObj.news.map((e, key) => {
        let info = '';
        if (e.author)
            info = `${e.author} - `;
        info += e.publishedAt;
        return (
            <a target='_blank' href={e.url} key={key.toString()}>
                <div className={styles['news-entry']}>
                    <table><tbody>
                        <tr>
                            <td className={styles['img-entry']}>
                                <img className={styles['img-entry']} src={e.urlToImage} />
                            </td>
                            <td className={styles['title-author-entry']}>
                                <div className={styles['title-entry']}>{e.title}</div>
                                <div className={styles['author-entry']}>{info}</div>
                            </td>
                        </tr>
                    </tbody></table>
                    <div className={styles['description-entry']}>{e.description}</div>
                </div>
            </a>
        );
    });
    const width = Math.min(defaultWidth, newsObj.window_x);
    // The zIndex is for a postCSS bug.
    const style = { width: `${width}px`, zIndex:99999 };
    //IE11 hack, overflows div in spite of maxHeight being set. Must set height.
    if (typeof document.body.style['msTextCombineHorizontal'] !== 'undefined')
        style.height = `${newsObj.window_y}px`;
    else
        style.maxHeight = `${newsObj.window_y}px`;
    return (
        <div> 
            <div className={styles['cover']} />
            <div className={styles['news-container']} style={style}>
                <div>
                    <div id='closeNews' className={styles['news-exit']} onClick={() => { closeNews(); }}>X</div>
                    <div className={styles['news-title']}>
                        { newsObj.newsSource }
                    </div>  
                </div>    
                <div id='getNewsEffect' className={styles['news-article-container']}>
                    { tlist }
                </div>    
            </div>
        </div>    
    );
};

const NewSourcesButtons = ({ isBusy, getNewsSources, clear }) =>
    <div>
        <RaisedButton id='getNewsSources' className={styles['ajax-button-container']} disabled={isBusy} label="Ajax Load" onClick={getNewsSources} />
        <RaisedButton id='clearNewsSources' className={styles['ajax-button-container']} disabled={isBusy} secondary={true} label="Clear" onClick={clear} />
    </div>;

export { NewSourcesButtons, NewsContainer, ErrorMessage, LoaderNews };


