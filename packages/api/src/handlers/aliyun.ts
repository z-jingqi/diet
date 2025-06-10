import { handleRequest } from '../services/request-handler';

export const handler = async (req: any, resp: any) => {
  try {
    const result = await handleRequest({
      method: req.method,
      path: req.path,
      body: req.body,
    });

    resp.setStatusCode(200);
    resp.setHeader('Content-Type', 'application/json');
    resp.send(JSON.stringify(result));
  } catch (error) {
    console.error('Error handling request:', error);
    resp.setStatusCode(500);
    resp.send(JSON.stringify({ error: 'Internal Server Error' }));
  }
}; 
