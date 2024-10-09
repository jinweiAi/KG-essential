import request from "./request.js";


//GraphList.vue
export const allGraphList = config => request._get('/graph/getAll',config);
export const createGraph = config => request._post('/graph/createGraph',config);
export const updateGraph = config => request._post('/graph/updateGraph',config);
export const deleteGraph = config => request._post('/graph/deleteGraph',config);


//StructuralData.vue
export const uploadFile = config => request._post('/task/uploadFile',config);
export const getAllFile = config => request._get('/task/allFile',config);
export const deleteFileById = config => request._get('/task/deleteFile',config);
// export const fetchContent = config => request._get('/task/fetchFileContent',config);
export const downloadOne = config => request._get('/task/downloadFile',config);
export const downloadFiles = config => request._get('/task/downloadMultipleFiles',config);