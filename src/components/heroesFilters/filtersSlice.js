import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

// const initialState = {
//     filters: [],
//     filtersLoadingStatus: 'idle',
//     activeFilter: 'all'
// }

const filtersAdapter = createEntityAdapter();

const initialState = filtersAdapter.getInitialState({
    filtersLoadingStatus: 'idle',
    activeFilter: 'all'
});

export const fetchFilters = createAsyncThunk(
    'filters/fetchFilters',
    () => {
        const { request } = useHttp();
        return request("http://localhost:3001/filters");
    }
); 

// const filtersSlice = createSlice({
//     name: 'filters',
//     initialState,
//     reducers: {
//         filtersFetching: state => {state.filtersLoadingStatus = 'loading'},
//         filtersFetched: (state, action) => {
//             state.filtersLoadingStatus = 'idle';
//             state.filters = action.payload;
//         },
//         filtersFetchingError: state => {
//             state.filtersLoadingStatus = 'error';
//         },
//         filtersChanged: (state, action) => {
//             state.activeFilter = action.payload;
//         }
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchFilters.pending, (state) => {state.filtersLoadingStatus = 'loading'})
//             .addCase(fetchFilters.fulfilled, (state, action) => {
//                 state.filtersLoadingStatus = 'idle';
//                 state.filters = action.payload;
//             })
//             .addCase(fetchFilters.rejected, (state) => {state.filtersLoadingStatus = 'error';})
//             .addDefaultCase(() => {})
//     }
// });

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        filtersChanged: (state, action) => {
            state.activeFilter = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilters.pending, state => {state.filtersLoadingStatus = 'loading'})
            .addCase(fetchFilters.fulfilled, (state, action) => {
                state.filtersLoadingStatus = 'idle';
                filtersAdapter.setAll(state, action.payload);
            })
            .addCase(fetchFilters.rejected, state => {
                state.filtersLoadingStatus = 'error';
            })
            .addDefaultCase(() => {})
    }
});

const {actions, reducer} = filtersSlice;

export default reducer;

export const {selectAll} = filtersAdapter.getSelectors(state => state.filters);

export const {
    filtersFetching,
    filtersFetched,
    filtersFetchingError,
    filtersChanged
} = actions;