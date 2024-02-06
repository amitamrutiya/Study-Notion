export const apiConnector = async (method, url, bodyData, headers, params) => {
  const options = {
    method: method,
    headers: headers || {},
    body: JSON.stringify(bodyData) || null,
  };

  if (params) {
    url += "?" + new URLSearchParams(params).toString();
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
};
