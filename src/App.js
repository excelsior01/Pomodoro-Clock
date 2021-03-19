import React, { useState } from "react";
import "./App.css";
import {
  ArrowDownward,
  ArrowUpward,
  RotateLeft,
  PlayArrow,
  Pause,
} from "@material-ui/icons";

import logo from "./star.jpg"

function App() {
  const [displayTime, setDisplayTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [sessionTime, setSessionTime] = useState(25 * 60);

  const [timer, setTimer] = useState(false);

  const [onBreak, setOnBreak] = useState(false);

  //audio
  const [breakAudio, SetBreakAudio] = useState(new Audio("./beep-07.mp3"));

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  const addtoBreak = (amount, type) => {
    if (type == "break") {
      if (
        (breakTime <= 60 && amount < 0) ||
        (breakTime >= 60 * 60 && amount >= 60)
      ) {
        return;
      }
      setBreakTime((prev) => prev + amount);
    } else {
      if (
        (sessionTime <= 60 && amount < 0) ||
        (sessionTime >= 60 * 60 && amount >= 60)
      ) {
        return;
      }

      setSessionTime((prev) => prev + amount);
      if (!timer) {
        setDisplayTime(sessionTime + amount);
        console.log(sessionTime);
      }
    }
  };

  const reset = () => {
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
    setTimer(false);
    clearInterval(localStorage.getItem("interval-id"));
  };

  const startClock = () => {
    let sec = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + sec;
    let onBreakVariable = onBreak;

    if (!timer) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setDisplayTime((prev) => {
            if (prev <= 0 && !onBreakVariable) {
              playSound();

              setOnBreak(true);
              return breakTime;
            } else if (prev <= 0 && onBreakVariable) {
              playSound();
              onBreakVariable = false;
              setOnBreak(false);
              return sessionTime;
            }
            return prev - 1;
          });
          nextDate += sec;
        }
      }, 30);

      localStorage.setItem("interval-id", interval);
    }
    if (timer) {
      clearInterval(localStorage.getItem("interval-id"));
      console.log("cleared interval ");
    }

    setTimer(!timer);
    console.log(timer);
  };

  const playSound = () => {
    breakAudio.currenTime = 0;
    breakAudio.play();
  };

  return (
    <div className='App'>
      <a href='https://github.com/excelsior01'>
        <img className='logo' src={logo} />{" "}
      </a>
      <div className='wrapper'>
        <h1>Pomodoro Clock</h1>
        <div className='container'>
          <Length
            title={"Break Time"}
            changetime={addtoBreak}
            type={"break"}
            time={breakTime}
            formatTime={formatTime}
            id='break-label'
            id2={"break"}
          />
          <Length
            title={"Session Time"}
            changetime={addtoBreak}
            type={"session"}
            time={sessionTime}
            formatTime={formatTime}
            id='session-label'
            id2={"session"}
          />
        </div>
        <h3 id='timer-label'>{onBreak ? "Break" : "Session"}</h3>
        <h1 id='time-left'>{`${formatTime(displayTime)}`}</h1>

        <div className='commands'>
          <button id='start_stop' onClick={startClock}>
            {timer ? (
              <Pause style={{ fill: "white" }} />
            ) : (
              <PlayArrow style={{ fill: "white" }} />
            )}
          </button>
          <div id='reset' className='reset'>
            <button id='reset-btn' onClick={reset}>
              <RotateLeft style={{ fill: "white" }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

function Length({ title, changetime, type, time, formatTime, id, id2 }) {
  return (
    <div id={id} className='length'>
      <h3>{title}</h3>
      <div className='time-sets'>
        <button
          className='btn-small deep-purple lighten-2'
          onClick={() => changetime(60, type)}
        >
          <ArrowUpward id={`${id2}-increment`} />
        </button>
        <div>
          <h2 id={id2 === "break" ? "break-length" : "session-length"}>
            {Math.floor(time / 60)}
          </h2>
        </div>

        <button
          className='card-panel teal lighten-2'
          onClick={() => changetime(-60, type)}
        >
          <ArrowDownward style={{ fill: "white" }} id={`${id2}-decrement`} />
        </button>
      </div>
    </div>
  );
}

 