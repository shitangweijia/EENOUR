export default function handler(req, res) {
    const prize = drawPrize();
    res.status(200).json({ message: `恭喜！你赢得了${prize}` });
  }
  
  function drawPrize() {
    const prizes = [
      { name: '奖品A', probability: 0.1 },
      { name: '奖品B', probability: 0.2 },
      { name: '奖品C', probability: 0.7 },
    ];
  
    const rand = Math.random();
    let sum = 0;
  
    for (const prize of prizes) {
      sum += prize.probability;
      if (rand <= sum) {
        return prize.name;
      }
    }
  }
  