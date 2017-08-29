import React from 'react';
import styles from './newsUI.scss';
import newsController from '../controller/newscontroller';

const NewsSources = ({ getNews, newsSources }) => {
    const tlist = newsSources.map( o => {
        return (
            <tr data-newsRow className={styles['news-row']} key={o.id} onClick={() => getNews(o.id, o.name)}>
                <td>{o.name}</td>
                <td>{o.description}</td>
            </tr>
        );
    });
    return(
        <div className={styles['change-form']}>
            <newsController.NewsContainer/>
            <newsController.ErrorMessage />
            <newsController.LoaderNews/>
            <div className={styles['change-form-text']}>
                {'Demonstrates a MVC component with asynchronous model functions.'}
            </div>
            <div className={styles['table-container']}>
                <table>
                    <tbody>
                      <tr>
                        <th>Name</th>
                        <th>Description</th>                       
                      </tr>
                      {tlist}
                    </tbody>
                </table>
            </div>
            <newsController.NewSourcesButtons/>  
        </div>
    );
};

export default NewsSources;
