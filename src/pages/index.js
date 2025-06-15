import { useEffect, useState, useRef } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [targetTime, setTargetTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const [completed, setCompleted] = useState(false);
  const audioRef = useRef(null);

  const calculateTimeLeft = (target) => {
    const difference = +new Date(target) - +new Date();
    if (difference <= 0) return null;
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  useEffect(() => {
    if (!targetTime) return;

    const timer = setInterval(() => {
      const updated = calculateTimeLeft(targetTime);
      if (!updated) {
        clearInterval(timer);
        setTimeLeft({});
        setCompleted(true);
        audioRef.current?.play();
      } else {
        setTimeLeft(updated);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  const handleStart = () => {
    const input = document.getElementById('datetime');
    const selected = new Date(input.value);
    if (!isNaN(selected.getTime())) {
      setTargetTime(selected);
      setCompleted(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Countdown Timer</h1>

        <div className={styles.inputSection}>
          <input type="datetime-local" id="datetime" />
          <button onClick={handleStart}>Start Countdown</button>
        </div>

        {!completed && timeLeft?.seconds !== undefined && (
          <div className={styles.timer}>
            <div>
              <span>{timeLeft.days}</span>
              <small>Days</small>
            </div>
            <div>
              <span>{timeLeft.hours}</span>
              <small>Hours</small>
            </div>
            <div>
              <span>{timeLeft.minutes}</span>
              <small>Minutes</small>
            </div>
            <div>
              <span>{timeLeft.seconds}</span>
              <small>Seconds</small>
            </div>
          </div>
        )}

        {completed && (
          <div className={styles.complete}>🎊 Time's up! 🎊</div>
        )}
      </div>

      <audio ref={audioRef} src="/celebration.mp3" preload="auto" />
    </main>
  );
}
