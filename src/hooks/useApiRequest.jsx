import { useState, useCallback } from "react";

const useApiRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (url, method, body = null) => {
    setLoading(true);
    setError(null);

    try {
      const options = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };
      if (body) options.body = JSON.stringify(body);

      const response = await fetch(url, options);
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Something went wrong");
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, sendRequest };
};

export default useApiRequest;
  