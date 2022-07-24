import { createSlice, createAsyncThunk, createEntityAdapter, createSelector} from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

const heroesAdapter = createEntityAdapter(); // При вызове эта функция вернёт объект, у которого будут уже готовые какие то методы,
                                             // колбэки, мемоизированные селекторы (функции которые позволяют вытащить кусочек store)

// const initialState = {
//     heroes: [],
//     heroesLoadingStatus: 'idle',
// }

const initialState = heroesAdapter.getInitialState({
    heroesLoadingStatus: 'idle'
});

export const fetchHeroes = createAsyncThunk(
    'heroes/fetchHeroes',
    async () => {     //Функция которая должна вернуть promise, т.е. асинхронный код
        const {request} = useHttp();
        return await request("http://localhost:3001/heroes");
    }
);

const heroesSlice = createSlice({
    name: 'heroes',
    initialState,
    reducers: {
        heroCreated: (state, action) => {
                    // state.heroes.push(action.payload);
                    heroesAdapter.addOne(state, action.payload);
                },
        heroDeleted: (state, action) => {
                    // state.heroes = state.heroes.filter(item => item.id !== action.payload);
                    heroesAdapter.removeOne(state, action.payload);
                }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHeroes.pending, (state) => {state.heroesLoadingStatus  = 'loading'}) // pending - это когда наш запрос или что-то асинхронное формируется (отправляется)
            .addCase(fetchHeroes.fulfilled, (state, action) => {
                state.heroesLoadingStatus  = 'idle';
                // state.heroes = action.payload;
                heroesAdapter.setAll(state, action.payload);
            }) //fulfilled - это когда наш promise/запрос или какая-то другая асинхронная операция выполнилась успешно
            .addCase(fetchHeroes.rejected, state => {state.heroesLoadingStatus  = 'error';}) // если вдруг произошла ошибка
            .addDefaultCase(() => {})
    }
});

const {actions, reducer} = heroesSlice;

export default reducer;

const {selectAll} = heroesAdapter.getSelectors(state => state.heroes);

export const filteredHeroesSelector = createSelector( //Производим мемоизацию
    (state) => state.filters.activeFilter,
    // (state) => state.heroes.entities,
    // (state) => state.heroes.heroes,
    selectAll,
    (filter, heroes) => {
        if (filter === 'all') {
            return heroes;
        } else {
            return heroes.filter(item => item.element === filter)
        }
    }
);

export const {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroCreated,
    heroDeleted
} = actions;