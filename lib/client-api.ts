export async function fetchArrayOrThrow<T>(url: string): Promise<T[]> {
  const response = await fetch(url);
  let data: unknown;

  try {
    data = await response.json();
  } catch (error) {
    throw new Error(`Unable to parse response from ${url}`);
  }

  if (!response.ok) {
    const message = typeof data === 'object' && data && 'error' in data ? (data as any).error : `Request failed with status ${response.status}`;
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (!Array.isArray(data)) {
    throw new Error(`Invalid response from ${url}. Expected an array.`);
  }

  return data;
}
