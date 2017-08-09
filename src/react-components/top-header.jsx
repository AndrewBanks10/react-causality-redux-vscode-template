import React from 'react';
import styles from '../stylesheets/top-header';
import img from '../assets/react.png';

const TopHeader = () =>
    <div className={styles.topContainer}>
        <div className={styles.reactContainer}>
            <img className={styles.reactLogo} src={img} />
        </div>
        <div className={styles.topTextContainer}>
            <h1>React Development Starter Kit Demo</h1>
            <div>Supports vscode debugging, react hot re-loading, css hot re-loading, business code hot re-loading. For production builds, supports choice of
                dll libraries or one minimized js bundle. Supports less, css, sass, scss with and without css modules.
                Built in support for react mocha testing and vscode debugging for the testing.
                <a href='https://github.com/AndrewBanks10/react-causality-redux-vscode-template' target='_blank'> Github link to project.</a>
            </div>
        </div>
    </div>;
export default TopHeader;