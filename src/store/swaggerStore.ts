import { createStore } from 'redux';

const dummyReducer = (state = {}): object => state;

const swaggerStore = createStore(dummyReducer);

export default swaggerStore;
