import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const endpoints = {
  p: "http://20.244.56.144/evaluation-service/primes",
  f: "http://20.244.56.144/evaluation-service/fibo",
  e: "http://20.244.56.144/evaluation-service/even",
  r: "http://20.244.56.144/evaluation-service/rand",
};

const WINDOW_SIZE = 10;

export default function AverageCalculator({ numberType }) {
  const [responseObj, setResponseObj] = useState(null);
  const storedNumbersRef = useRef([]);

  useEffect(() => {
    async function fetchNumbers() {
      if (!endpoints[numberType]) {
        // Invalid ID, do nothing or clear state
        setResponseObj(null);
        return;
      }

      const prevState = [...storedNumbersRef.current];
      console.log("Fetching for type:", numberType);

      try {
        const res = await axios.get(endpoints[numberType], { timeout: 500 });
        console.log("Response received:", res.data);
        const fetchedNumbers = res.data.numbers || [];

        // Filter out duplicates already stored
        const uniqueNewNumbers = fetchedNumbers.filter(
          (num) => !storedNumbersRef.current.includes(num)
        );

        // Add new unique numbers to stored numbers
        let combinedNumbers = [...storedNumbersRef.current, ...uniqueNewNumbers];

        // Enforce window size limit by removing oldest if needed
        if (combinedNumbers.length > WINDOW_SIZE) {
          combinedNumbers = combinedNumbers.slice(
            combinedNumbers.length - WINDOW_SIZE
          );
        }

        // Update stored numbers
        storedNumbersRef.current = combinedNumbers;

        // Calculate average of numbers currently stored
        const sum = combinedNumbers.reduce((acc, val) => acc + val, 0);
        const avg =
          combinedNumbers.length > 0
            ? parseFloat((sum / combinedNumbers.length).toFixed(2))
            : 0;

        // Prepare the response object exactly as requested
        const response = {
          windowPrevState: prevState,
          windowCurrState: combinedNumbers,
          numbers: combinedNumbers,
          avg: avg,
        };

        setResponseObj(response);
      } catch (error) {
        // Ignore errors/timeouts; keep previous state and do nothing
      }
    }

    fetchNumbers();
  }, [numberType]);

  return (
    <div>
      <h2>Average Calculator</h2>
      <p>Select Number Type: {numberType}</p>
      {responseObj ? (
        <pre>{JSON.stringify(responseObj, null, 2)}</pre>
      ) : (
        <p>Loading or invalid number type...</p>
      )}
    </div>
  );
}
