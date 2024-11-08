"use client";

import * as React from "react";
import dayjs, { extend } from "dayjs";
import duration from "dayjs/plugin/duration";
extend(duration);

// Function to format time left
export const formatTime = (milliseconds: number): string => {
  const seconds = milliseconds / 1000;
  const currentDuration = dayjs.duration(seconds, "seconds");
  const displayMinutes = String(currentDuration.minutes()).padStart(2, "0");
  const displaySeconds = String(currentDuration.seconds()).padStart(2, "0");

  return `${displayMinutes}:${displaySeconds}`;
};

/**
 * Custom hook for countdown timer functionality.
 *
 * @param {number} [timeToCount=60000] - The total time to count down from in milliseconds, defaults to 60000 milliseconds.
 * @param {number} [interval=1000] - The interval in milliseconds at which the countdown updates, defaults to 1000 milliseconds.
 * @returns {[number, Object]} - Returns the time left in milliseconds and a set of actions to control the countdown.
 * @property {function} start - Starts the countdown from the provided time or default.
 * @property {function} pause - Pauses the countdown.
 * @property {function} resume - Resumes the countdown from where it was paused.
 * @property {function} reset - Resets the countdown to zero.
 */
export const useCountDown = (
  timeToCount: number = 60 * 1000,
  interval: number = 1000
): [
  number,
  {
    start: (ttc?: number) => void;
    pause: () => void;
    resume: () => void;
    reset: () => void;
    format: string;
  }
] => {
  const [timeLeft, setTimeLeft] = React.useState<number>(0);
  const timer = React.useRef<{
    started: number | null;
    lastInterval: number | null;
    timeToCount: number;
    timeLeft: number;
    requestId: number | null;
  }>({
    started: null,
    lastInterval: null,
    timeToCount,
    timeLeft: 0,
    requestId: null,
  });

  const run = (ts: number) => {
    if (!timer.current.started) {
      timer.current.started = ts;
      timer.current.lastInterval = ts;
    }

    const localInterval = Math.min(
      interval,
      timer.current.timeLeft || Infinity
    );
    if (ts - (timer.current.lastInterval || 0) >= localInterval) {
      timer.current.lastInterval =
        (timer.current.lastInterval ?? 0) + localInterval;
      setTimeLeft((timeLeft) => {
        timer.current.timeLeft = timeLeft - localInterval;
        return timer.current.timeLeft;
      });
    }

    if (ts - (timer.current.started || 0) < timer.current.timeToCount) {
      timer.current.requestId = window.requestAnimationFrame(run);
    } else {
      timer.current = {
        started: null,
        lastInterval: null,
        timeToCount: 0,
        timeLeft: 0,
        requestId: null,
      };
      setTimeLeft(0);
    }
  };

  const start = React.useCallback(
    (ttc?: number) => {
      if (timer.current.requestId !== null) {
        window.cancelAnimationFrame(timer.current.requestId);
      }

      const newTimeToCount = ttc !== undefined ? ttc : timeToCount;
      timer.current.started = null;
      timer.current.lastInterval = null;
      timer.current.timeToCount = newTimeToCount;
      timer.current.requestId = window.requestAnimationFrame(run);

      setTimeLeft(newTimeToCount);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [timeToCount]
  );

  const pause = React.useCallback(() => {
    if (timer.current.requestId !== null) {
      window.cancelAnimationFrame(timer.current.requestId);
    }
    timer.current.started = null;
    timer.current.lastInterval = null;
    timer.current.timeToCount = timer.current.timeLeft;
  }, []);

  const resume = React.useCallback(() => {
    if (!timer.current.started && timer.current.timeLeft > 0) {
      if (timer.current.requestId !== null) {
        window.cancelAnimationFrame(timer.current.requestId);
      }
      timer.current.requestId = window.requestAnimationFrame(run);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = React.useCallback(() => {
    if (timer.current.timeLeft) {
      if (timer.current.requestId !== null) {
        window.cancelAnimationFrame(timer.current.requestId);
      }
      timer.current = {
        started: null,
        lastInterval: null,
        timeToCount: 0,
        timeLeft: 0,
        requestId: null,
      };
      setTimeLeft(0);
    }
  }, []);

  const actions = React.useMemo(
    () => ({ start, pause, resume, reset, format: formatTime(timeLeft) }),
    [start, pause, resume, reset, timeLeft]
  );

  React.useEffect(() => {
    return () => {
      if (timer.current.requestId !== null) {
        window.cancelAnimationFrame(timer.current.requestId);
      }
    };
  }, []);

  return [timeLeft, actions];
};
