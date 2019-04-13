// const { argv } = require('optimist')
const axios = require('axios');
// Debug log for http traffic
// if (process.env.ENV === 'pp' || process.env.ENV === 'beta') {
// if (process.env.MODE !== 'prod') {
//   axios.interceptors.request.use((request) => {
//     console.info('\n[debug] Request:');
//     console.info(request.method.toUpperCase());
//     console.info(request.url);
//     console.info('params: ', request.params);
//     console.info('query: ', request.query);
//     console.info('Headers:   ', request.headers);
//     console.info('Data:      ', JSON.stringify(request.data, null, 2));
//     return request;
//   });

//   axios.interceptors.response.use(
//     (response) => {
//       console.info('\n[debug] Response:');
//       console.info('status:    ', response.status);
//       console.info('Data:      ', response.data);
//       return response;
//     },
//     (error) => {
//       const { response = {} } = error;
//       const { status, data, headers } = response;
//       console.info('\n[debug] Response Error:');

//       if (error.data) console.info('[EXCEPTION] error.data:    ', error.data);

//       console.info('status:                    ', status);
//       console.info('Data:                      ', JSON.stringify(data));
//       console.info('Headers:                   ', headers);
//       throw error;
//     }
//   );
// }
