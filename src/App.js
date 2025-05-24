import React, { useState } from 'react';
import AverageCalculator from './AverageCalculator';

function App() {
  const [type, setType] = useState('p'); // default to 'p' for primes

  return (
    <div>
      <h1>Average Calculator</h1>
      <select onChange={(e) => setType(e.target.value)} value={type}>
        <option value="p">Prime</option>
        <option value="f">Fibonacci</option>
        <option value="e">Even</option>
        <option value="r">Random</option>
      </select>

      <AverageCalculator numberType={type} />
    </div>
  );
}

export default App;
