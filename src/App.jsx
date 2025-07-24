import { useEffect, useRef, useState } from 'react'
import './App.css'


const sentence = [
  "Don’t comment bad code—rewrite it",
  "When in doubt, use brute force.",
  "First, solve the problem. Then, write the code.",
  "Programming is not about typing, it's about thinking.",
  "A day without debugging is like a day without sunshine.",
  "My code doesn't have bugs; it just develops random features",
  "Programming is the closest thing we have to magic.",
  `There is no place like 127.0.0.1.`,
  "Stack Overflow is my second brain",
  `Running npm install, see you in 5 years`
]

function App() {

  const [text, setText] = useState("");
  const [input, setInput] = useState("");

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [result, setResult] = useState(null);
  const [resultHistory, setResultHistory] = useState([]);

  const [timer, setTimer] = useState(60);

  const inputRef = useRef(null);

  useEffect(() => {
    resetTest();
  }, []);

  useEffect(() => {
    let interval;
    if (startTime && !endTime && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0 && !result) {
      calculateResult(startTime, new Date(), true);
    }

    return () => clearInterval(interval);
  }, [startTime, timer, endTime, result])

  const resetTest = () => {
    const random = sentence[Math.floor(Math.random() * sentence.length)];

    setText(random);
    setInput("");
    setStartTime(null);
    setEndTime(null);
    setTimer(60);
    setResult(null)
    inputRef.current.focus();
  }

  const handleChange = (event) => {
    const val = event.target.value;
    setInput(val);

    if (!startTime && val.length > 0) {
      const now = new Date();
      setStartTime(now);
    }

    if (val == text) {
      const end = new Date();
      setEndTime(end);
      calculateResult(startTime, end);
    }
  }

  const calculateResult = (start, end, isTimeOut = false) => {
    const timeTaken = (end - start) / 1000;
    const words = text.trim().split(" ").length;
    const speed = Math.round((words / timeTaken) * 60);
    const correctChar = input.split("").filter((ch, i) => ch === text[i]).length;
    const accuracy = Math.round((correctChar / text.length) * 100);

    const result = {
      speed: isTimeOut ? 0 : speed,
      accuracy,
      time: isTimeOut ? 60 : timeTaken.toFixed(2),
    };

    setResult(result);
    setResultHistory((prev) => [result, ...prev]);
  };

  const getHighlighted = () => {
    return text.split("").map((char, idx) => {
      let typedChar = input[idx];

      let className = "";

      if (typedChar === undefined) {
        className = "";
      }

      else if (typedChar === char) {
        className = "correct";
      }

      else {
        className = "incorrect";
      }

      return (
        <span key={idx} className={className}>
          {char}
        </span>);
    });
  };

  return (
    <div className="particles">
      < div className='container' >
        <h1>Typing Speed Tester</h1>
        <p className='timer'>Timer left: {timer}s</p>

        <div className="box">
          <p className="quote">
            {getHighlighted()}
          </p>

          <textarea ref={inputRef} className='input' placeholder='Start typing here...' value={input} onChange={handleChange} disabled={result || timer === 0}></textarea>

          {result ? (<div className='result'>
            <p>Speed: {result.speed} WPM</p>
            <p>Accuracy: {result.accuracy} %</p>
            <p>Time Taken: {result.time} seconds</p>
            <button onClick={resetTest}>Try Again</button>
          </div>)
            :
            (<p className='instruction'>Type the above sentence to test your speed.</p>)
          }
        </div>

        <div className="bubbles">
  {Array.from({ length: 10 }).map((_, i) => (
    <span key={i} className="bubble"></span>
  ))}
</div>

        {
          resultHistory.length > 0 && (<div className='History'>
            <h3>Past Result</h3>
            {/* <ul> */}
            {resultHistory.map((r, i) => (
              <li key={i}>
                <b>{i + 1}.</b> Speed: {r.speed} WPM | Accuracy: {r.accuracy}% | Time: {r.time}s
              </li>
            ))}
            {/* </ul> */}
          </div>)
        }
      </div>
    </div>
  )
}

export default App
