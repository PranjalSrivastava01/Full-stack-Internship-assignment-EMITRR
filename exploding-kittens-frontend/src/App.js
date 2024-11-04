import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import CardBlock from './components/CardBlock';
import Toast from './components/Toast';
import NameForm from './components/NameForm';
import LeaderBoard from './components/LeaderBoard';
import backgroundVideo from './assets/Exploding.mp4';

function App() {
  const [toastMessage, setToastMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [cards, setCards] = useState([]);
  const [flippedArray, setFlippedArray] = useState([]);
  const [points, setPoints] = useState(0);
  const [updatedPoints, setUpdatedPoints] = useState(0);
  const [count, setCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [allCardsDrawn, setAllCardsDrawn] = useState(false);

  const generateCards = () => {
    const cardTypes = ['cat', 'defuse', 'exploding', 'shuffle'];
    setCards(Array.from({ length: 5 }, () => cardTypes[Math.floor(Math.random() * cardTypes.length)]));
  };

  const handleNameSubmit = (name) => {
    setUserName(name);
    setGameStarted(true);
  };

  const handleCardFlip = (index, cardType) => {
    const updateCardState = () => {
      const newCards = [...cards];
      newCards.splice(index, 1);
      setCards(newCards);

      const newFlippedArray = [...flippedArray];
      newFlippedArray[index] = true;
      setFlippedArray(newFlippedArray);

      if (newCards.length === 0) setAllCardsDrawn(true);
    };

    setTimeout(() => {
      switch (cardType) {
        case 'defuse':
          setCount(count + 1);
          setToastMessage('You can defuse an exploding kitten now!');
          break;
        case 'cat':
          setToastMessage('Meow! Meow Meow! You are definitely gonna...');
          break;
        case 'shuffle':
          setCount(0);
          setToastMessage('All Cards are shuffled, start from the beginning');
          generateCards();
          return;
        case 'exploding':
          if (count > 0) {
            setCount(count - 1);
            setToastMessage('Oops! You defused the bomb, but be cautious!');
          } else {
            setToastMessage('Game Over! You drew an exploding kitten and you have no defuse card.');
            setGameStarted(false);
            window.location.reload();
          }
          break;
        default:
          setToastMessage('All Cards drawn successfully!');
      }
      updateCardState();
    }, 700);
  };

  const fetchUserPoints = async () => {
    try {
      const response = await fetch(`https://backend-emittr2-h3ou.onrender.com/api/user/points?name=${userName}`);
      if (response.ok) {
        const data = await response.json();
        setPoints(data);
      }
    } catch (error) {
      console.error('Error fetching user points:', error);
    }
  };

  const updateUserPoints = async () => {
    try {
      await fetch('https://backend-emittr2-h3ou.onrender.com/api/user/points', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName }),
      });
      const response = await fetch(`https://backend-emittr2-h3ou.onrender.com/api/user/points?name=${userName}`);
      const data = await response.json();
      setUpdatedPoints(data);
    } catch (error) {
      console.error('Error updating user points:', error);
    }
  };

  useEffect(() => {
    if (gameStarted) {
      generateCards();
      fetchUserPoints();
    }
  }, [gameStarted, userName]);

  useEffect(() => {
    if (allCardsDrawn) {
      updateUserPoints();
    }
  }, [allCardsDrawn, userName]);

  useEffect(() => {
    setFlippedArray(Array(cards.length).fill(false));
  }, [cards]);

  return (
    <div className="App">
      {/* Background Video */}
      <video 
        autoPlay 
        loop 
        muted 
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: '-1',
          filter: 'blur(10px)',
        }}
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      {gameStarted ? (
        <>
          <Navbar points={updatedPoints || points} userName={userName} />
          <div className="card-container">
            {cards.map((card, index) => (
              <CardBlock key={index} cardType={card} index={index} onCardFlip={handleCardFlip} flippedArray={flippedArray} />
            ))}
          </div>
          {toastMessage && <Toast message={toastMessage} />}
        </>
      ) : (
        <NameForm onNameSubmit={handleNameSubmit} />
      )}
      {allCardsDrawn && <LeaderBoard points={points} userName={userName} />}
    </div>
  );
}

export default App;
