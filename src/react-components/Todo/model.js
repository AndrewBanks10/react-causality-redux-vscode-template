const STORAGE_KEY = 'todo';

export const fetch = () => 
    JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

export const save = (todos) =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));

