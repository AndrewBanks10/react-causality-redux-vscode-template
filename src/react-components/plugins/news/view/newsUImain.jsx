import React from 'react';
import styles from './newsUI.scss';
import newsController from '../controller/newscontroller';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import NavMenu from '../../../../react-components/NavMenu/controller';

const NewsForm = ({ getNews, newsSources }) => {
    const tlist = newsSources.map( o => {
        return (
            <tr data-newsRow className={styles['news-row']} key={o.id} onClick={() => getNews(o.id, o.name)}>
                <td>{o.name}</td>
                <td>{o.description}</td>
            </tr>
        );
    });
    return(
        <div>
        <AppBar
            title='Demonstrates a MVC component with asynchronous model functions.'
            iconElementLeft={<NavMenu useHome={'useHome'} />}
        />
            <Paper zDepth={4}>
                <newsController.NewsContainer/>
                <newsController.ErrorMessage />
                <newsController.LoaderNews/>
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
                <newsController.NewSourcesButtons />  
            </Paper>    
        </div>
    );
};

export default NewsForm;
