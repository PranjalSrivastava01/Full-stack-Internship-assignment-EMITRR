import React, { useState, useEffect } from 'react';
import '../App.css';
import cat1 from '../assets/cat1.png';
import cat2 from '../assets/cat2.png';
import cat3 from '../assets/cat3.png';
import cat4 from '../assets/cat4.png';

function CardBlock({ cardType, index, onCardFlip, flippedArray }) {
  const [flipped, setFlipped] = useState(flippedArray[index]);

  useEffect(() => {
    setFlipped(flippedArray[index]);
  }, [flippedArray, index]);

  const handleClick = () => {
    if (flipped) return;
    setFlipped(true);
    onCardFlip(index, cardType);
  };

  const cardBackImage = () => {
    const images = {
      cat: cat1,
      defuse: cat2,
      shuffle: cat3,
      exploding: cat4
    };
    return images[cardType] || '';
  };

  return (
    <div className={`card-block ${flipped ? 'flipped' : ''}`} onClick={handleClick}>
      <div className="card-front">?</div>
      <div
        className="card-back"
        style={{
          backgroundImage: `url(${cardBackImage()})`,
          backgroundSize: '80%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      ></div>
    </div>
  );
}

export default CardBlock;
