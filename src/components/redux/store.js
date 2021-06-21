import { createStore } from "redux";

export const ADD_DATA = 'ADD_DATA';

export function addData(data) {
    return {
      type: ADD_DATA,
      payload: data
    };
}

const initialState = {
    allFlights: [],
};

function addReducer(state = initialState, action) {
    switch (action.type) {
      case ADD_DATA:
        const newState = { ...state };
        newState.allFlights = action.payload.body;
        return newState;

      default:
        return state;
    }
  }

const store = createStore(addReducer);

export default store;
