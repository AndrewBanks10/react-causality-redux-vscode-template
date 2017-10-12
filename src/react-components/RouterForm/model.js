import { history } from 'react-causality-redux-router';

export const replaceHistory = (url) => {
    history.replace(url);
};

export const historyGo = (goText) => {
    history.go(goText);
};

export const historyForward = () => {
    history.goForward();
};

export const historyBack = () => {
    history.goBack();
};

