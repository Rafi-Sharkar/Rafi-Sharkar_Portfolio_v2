export const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const parseJsonBody = (event) => {
  if (!event?.body) {
    return {};
  }

  try {
    return JSON.parse(event.body);
  } catch {
    return {};
  }
};

export const getQueryId = (event) => {
  const rawId = event?.queryStringParameters?.id;
  if (!rawId) {
    return null;
  }

  const parsedId = Number(rawId);
  return Number.isFinite(parsedId) ? parsedId : null;
};

