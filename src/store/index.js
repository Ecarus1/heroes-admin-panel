import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk'
import heroes from '../reducers/heroes';
import filters from '../reducers/filters';

//applyMiddleware функция, которая последовательно модифицирует dispatch


//Middleware занимается только функцией dispatch
// const stringMiddleware = ({dispatch, getState}) => (dispatch) => (action) => {
const stringMiddleware = (store) => (next) => (action) => {
    if (typeof action === 'string') {
        return next({
            type: action
        });
    }

    return next(action);
}

//Enhancer - это усилитель нашего store (расширение store)
//Такми образом добиваемся результата, что при передаче в функцию dispatch() строку приложение нормально реагирует
//Пример в файле HeroesList.js в useEffect()
// const enhancer = (createStore) => (...args) => {
//     const store = createStore(...args);

//     const oldDispatch = store.dispatch; // нужно сохранить оригинальный dispatch
//     store.dispatch = (action) => { //меняем его значение. переопределяем его действие
//         if (typeof action === 'string') {
//             return oldDispatch({
//                 type: action
//             });
//         }

//         return oldDispatch(action);
//     }

//     return store;
// }

const store = createStore(
    combineReducers({heroes, filters}),
    compose(
        applyMiddleware(ReduxThunk, stringMiddleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
    // compose(                    //При подключении как Middleware, так и Enhancer'ов нужно соблюдать правильный порядок их работы
    //     enhancer,
    //     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    // ) // функция compose предназначена для соединения функций
);

export default store;