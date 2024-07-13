import { useState } from 'react';

export default function Home() {
  const [result, setResult] = useState(null);

  const handleDraw = async () => {
    const res = await fetch('/api/draw');
    const data = await res.json();
    setResult(data.message);
  };

  return (
    <div>
      <h1>抽奖活动</h1>
      <button onClick={handleDraw}>抽奖</button>
      {result && <p>{result}</p>}
    </div>
  );
}
