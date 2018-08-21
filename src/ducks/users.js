import axios from 'axios';


const initialState = {
    user: {},//
    colorArr: [],//
    makeArr: [],//
    modelArr: [],//
    yearArr: [],//
    inventoryArr: [],
    waitlistArr: [],
    todaysDate: '',
    navbarSlide: false
}

//action Types go here:
const GET_USER = 'GET_USER';
const GET_COLOR_ARRAY = 'GET_COLOR_ARRAY';
const GET_MAKE_ARRAY = 'GET_MAKE_ARRAY';
const GET_MODEL_ARRAY = 'GET_MODEL_ARRAY';
const GET_YEAR_ARRAY = 'GET_YEAR_ARRAY';




export default function reducer(state = initialState, action) {
    switch (action.type) {
        //Cases go here
        case GET_USER + '_FULFILLED':
            return Object.assign({}, state, { user: action.payload });
        case GET_COLOR_ARRAY:
            return Object.assign({}, state, { colorArr: action.payload });
        case GET_MAKE_ARRAY:
            return Object.assign({}, state, { makeArr: action.payload });
        case GET_MODEL_ARRAY:
            return Object.assign({}, state, { modelArr: action.payload });
        case GET_YEAR_ARRAY:
            return Object.assign({}, state, { yearArr: action.payload });


        default:
            return state;
    }

}
//action creators
export function getUser() {
    let userData = axios.get('/auth/me')
        .then(res => {
            return res.data;
        })
    return {
        type: GET_USER,
        payload: userData
    }
}
export function getColorArr(colorArr) {
    return {
        type: GET_COLOR_ARRAY,
        payload: colorArr
    }
}
export function getMakeArr(makeArr) {
    return {
        type: GET_MAKE_ARRAY,
        payload: makeArr
    }
}
export function getModelArr(modelArr) {
    return {
        type: GET_MODEL_ARRAY,
        payload: modelArr
    }
}
export function getYearArr(yearArr) {
    return {
        type: GET_YEAR_ARRAY,
        payload: yearArr
    }
}
