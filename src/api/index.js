import request from "./request.js";

/* GraphList.vue */
export const allGraphList = config => request._get('/graph/getAll',config);
export const createGraph = config => request._post('/graph/createGraph',config);
export const updateGraph = config => request._post('/graph/updateGraph',config);
export const deleteGraph = config => request._post('/graph/deleteGraph',config);


/* StructuralData.vue */
export const uploadFile = config => request._post('/file/uploadFile',config);
export const getAllFile = config => request._get('/file/allFile',config);
export const deleteFileById = config => request._get('/file/deleteFile',config);
// export const fetchContent = config => request._get('/file/fetchFileContent',config);
export const downloadOne = config => request._get('/file/downloadFile',config);
export const downloadFiles = config => request._get('/file/downloadMultipleFiles',config);


/* StructuredMapping.vue */
export const createNewTask = config => request._get('/task/createTask',config);
export const getFileInfo = config => request._get('/file/findFile',config);
export const getAllTask = config => request._get('/task/allTask',config);
export const updateTask = config => request._get('/task/updateTask',config);
export const deleteTaskById = config => request._get('/task/deleteTask',config);
