import { useEffect, useRef, useState } from "react";
import secondsToTime from "../utils/timeConversion";

export default function useCountDownTimer(initialState) {
  const [seconds, setSeconds] = useState(initialState);
  const [isTimeLeft, setIsTimeLeft] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timeout;
    if (isRunning) {
      if (seconds === undefined || seconds === null || seconds == "null") {
        console.log("invalid time");
      } else {
        // save current seconds && running status

        localStorage.setItem("time", seconds);

        if (seconds === 0) {
          stop();
        } else {
          timeout = setTimeout(() => {
            setSeconds(seconds - 1);
          }, 1000);
        }
      }
    } else {
      clearTimeout(timeout);
    }

    return () => clearTimeout(timeout);
  }, [seconds, isRunning]);

  const stop = () => {
    setSeconds(0);
    setIsRunning(false);
    setIsTimeLeft(false);
    localStorage.setItem("active", JSON.stringify(false));
    localStorage.setItem("time", 0);
  };

  const start = () => {
    const seconds = localStorage.getItem("time");
    setSeconds(seconds);
    console.log("starting timer", seconds);
    // first load
    const active = JSON.parse(localStorage.getItem("active"));

    if (active === null) {
      console.log("active:null ", active);
      localStorage.setItem("active", true);
      setIsRunning(true);
      setIsTimeLeft(true);
      return;
    }

    if (active) {
      // active is true
      console.log("active:true ", active);
      setIsRunning(true);
      setIsTimeLeft(true);
    } else {
      // active is false
      console.log("active:false ", active);
      setIsRunning(false);
    }
  };

  const resume = () => {
    // console.log("resume: ", localStorage.getItem("active"));
    localStorage.setItem("active", true);
    if (seconds) {
      setIsRunning(true);
      setSeconds(seconds);
    }
    setIsRunning(true);
  };

  const pause = () => {
    // console.log("pause: ", localStorage.getItem("active"));
    localStorage.setItem("active", false);
    setIsRunning(false);
  };

  // const reset = () => {}

  return [isTimeLeft, seconds, isRunning, start, resume, stop, pause];
}
