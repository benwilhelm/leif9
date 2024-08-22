import './style.css';
import { Timer } from './timer';
import { Solution } from './solution';

const timer = new Timer();
const solution = new Solution();

const [bodyEl] = document.getElementsByTagName('body')!;
const statusEl = document.getElementById('status')!;
const clockEl = document.getElementById('clock')!;
const promptEl = document.getElementById('prompt')!;

// @ts-expect-error
const alarmAudioEl: HTMLAudioElement = document.getElementById('alarm_audio')!


// @ts-expect-error
const successAudioEl: HTMLAudioElement = document.getElementById('success_audio')!

// @ts-expect-error
const inputEl: HTMLInputElement = document.getElementById('secret_input')!;
const letterEls = document.querySelectorAll<HTMLElement>('.letter')!;
const lettersEl = document.getElementById('letters')!;

const keydownHandler = (ev: KeyboardEvent) => {
  if (ev.key === 'Enter') {
    const guess = inputEl.value;
    solution.check(guess);
    inputEl.focus();
  }
};

const firstKeyHandler = async (_ev: KeyboardEvent) => {  
  bodyEl.style.backgroundColor = '#A00';
  await progressiveText('SELF-DESTRUCT MODE ACTIVATED', statusEl);
  
  await delay(100)
  showElement(clockEl)
  showElement(lettersEl)
  timer.start();
  window.addEventListener('keydown', keydownHandler);
  window.removeEventListener('keydown', firstKeyHandler);
  inputEl.focus();
};
window.addEventListener('keydown', firstKeyHandler);

solution.addEventListener('failure', async () => {
  inputEl.value = '';
  await progressiveText('INCORRECT DEACTIVATION KEY', promptEl);
  await delay(1500);
  await progressiveText('Enter deactivation key', promptEl);
});

solution.addEventListener('success', async () => {
  timer.deactivate();
  inputEl.removeEventListener('keyup', keyupListener);
  window.removeEventListener('keydown', keydownHandler);
  bodyEl.style.backgroundColor = 'green';
  await progressiveText('DEACTIVATION KEY ACCEPTED', promptEl);
  await progressiveText('Self-destruct mode DEACTIVATED', statusEl);
  blinkBackground(['green', 'blue', 'yellow', 'orange'], 500);
  successAudioEl.play()
});

timer.addEventListener('start', async () => {
  await progressiveText('Enter deactivation key', promptEl);
});

timer.addEventListener('tick', (timeRemaining) => {
  clockEl.innerText = formatTime(timeRemaining);
});

timer.addEventListener('expire', async () => {
  letterEls.forEach(hideElement);
  hideElement(promptEl);
  await progressiveText('INITIATING SELF-DESTRUCT SEQUENCE', statusEl);
  blinkBackground(['red', 'black'], 610);
  alarmAudioEl.play()
});

const keyupListener = () => {
  const letters = inputEl.value.toUpperCase().split('');
  letterEls.forEach((el, idx) => {
    el.innerHTML = letters[idx] || '&nbsp;';
  });
};
inputEl.addEventListener('keyup', keyupListener);

function formatTime(seconds: number) {
  const lpad = (val: number) => (val < 10 ? `0${val}` : `${val}`);

  const mm = lpad(Math.floor(seconds / 60));
  const ss = lpad(seconds % 60);

  return `${mm}:${ss}`;
}

// @ts-expect-error
window.timer = timer;

async function progressiveText(text: string, el: HTMLElement) {
  const letters = text.split('');
  for (let idx = 0; idx < letters.length; idx++) {
    await delay(50);
    const subtext = letters.slice(0, idx + 1).join('');
    const pad = '*'.repeat(letters.length - idx - 1);
    el.innerText = subtext + pad;
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const hideElement = (el: HTMLElement) => (el.style.visibility = 'hidden');
const showElement = (el: HTMLElement) => (el.style.visibility = 'inherit');

function blinkBackground(colors: string[], interval = 500) {
  const colorQ = [...colors]
  bodyEl.style.backgroundColor = colorQ[0];
  const intervalId = setInterval(() => {
    colorQ.push(colorQ.shift()!);
    bodyEl.style.backgroundColor = colorQ[0];
  }, interval);

  return () => clearInterval(intervalId);
}


hideElement(clockEl)
hideElement(lettersEl)