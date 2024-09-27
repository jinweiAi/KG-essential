import request from "./request";


//GraphList.vue
export const allGraphList = config => request._get('/graph/getAll',config);
export const createGraph = config => request._post('/graph/createGraph',config);
export const updateGraph = config => request._post('/graph/updateGraph',config);
export const deleteGraph = config => request._post('/graph/deleteGraph',config);