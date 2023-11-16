import axios from "axios";
import { useEffect, useState } from "react";

export default function useNetwork(initialState, URL) {
  const [testData, setTestData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (testData) {
      setIsLoading(false);
    } else {
      axios
        .get(URL)
        .then((response) => {
          setTestData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [testData]);
  return [isLoading, testData];
}
