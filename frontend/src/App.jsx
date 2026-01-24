import React, { useState } from "react";

const App = () => {
  const quotes = [
    "The only limit to our realization of tomorrow is our doubts of today. – Franklin D. Roosevelt",
    "Do what you can, with what you have, where you are. – Theodore Roosevelt",
    "Happiness is not something ready made. It comes from your own actions. – Dalai Lama",
    "In the middle of every difficulty lies opportunity. – Albert Einstein",
    "Don’t watch the clock; do what it does. Keep going. – Sam Levenson",
    "Life is what happens when you’re busy making other plans. – John Lennon",
    "Believe you can and you’re halfway there. – Theodore Roosevelt",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
    "The purpose of our lives is to be happy. – Dalai Lama",
    "You miss 100% of the shots you don’t take. – Wayne Gretzky"
  ];

  const [quote, setQuote] = useState("");

  const generateQuote = () => {
    const randomNumber = Math.floor(Math.random() * quotes.length);
    console.log(randomNumber);
    setQuote(quotes[randomNumber]);
  };

  return (
    <div>
      <div>
        <p>{quote}</p>
      </div>
      <button onClick={generateQuote} type="button">
        Generate
      </button>
    </div>
  );
};

export default App;