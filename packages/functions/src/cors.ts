
export const handler = async () => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    'Access-Control-Allow-Headers': '*',
  };

  return {
    statusCode: 204, // No Content
    headers: headers,
    body: null,
  };
};
