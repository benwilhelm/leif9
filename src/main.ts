import './style.css';
import { Timer } from './timer';
import { Solution } from './solution';

const timer = new Timer();
const solution = new Solution();

const statusEl = document.getElementById('status')!;
const clockEl = document.getElementById('clock')!;
const promptEl = document.getElementById('prompt')!;

// @ts-expect-error
const inputEl: HTMLInputElement = document.getElementById('secret_input')!;
const letterEls = document.querySelectorAll<HTMLElement>('.letter')!;

const keydownHandler = (ev: KeyboardEvent) => {
  if (ev.key === 'Enter') {
    const guess = inputEl.value;
    solution.check(guess);
    inputEl.focus();
  }
};

const firstKeyHandler = (_ev: KeyboardEvent) => {
  timer.start()
  window.addEventListener('keydown', keydownHandler);
  window.removeEventListener('keydown', firstKeyHandler)
  inputEl.focus();
}
window.addEventListener('keydown', firstKeyHandler)

solution.addEventListener('failure', async () => {
  inputEl.value = '';
  await progressiveText("INCORRECT DEACTIVATION KEY", promptEl)
  await delay(1500)
  await progressiveText('Enter deactivation key', promptEl);
});

solution.addEventListener('success', async () => {
  timer.deactivate();
  inputEl.removeEventListener('keyup', keyupListener);
  window.removeEventListener('keydown', keydownHandler);
  blinkBackground(['green'])
  await progressiveText('DEACTIVATION KEY ACCEPTED', promptEl)
  await progressiveText('Self-destruct mode DEACTIVATED', statusEl)
  await delay(250)
  blinkBackground(['green', 'blue', 'yellow', 'orange'], 100)
});

timer.addEventListener('start', async () => {
  await progressiveText('SELF-DESTRUCT MODE ACTIVATED', statusEl);
  await progressiveText('Enter deactivation key', promptEl);
});

timer.addEventListener('tick', (timeRemaining) => {
  clockEl.innerText = formatTime(timeRemaining);
});

timer.addEventListener('expire', async () => {
  letterEls.forEach(hideElement)
  hideElement(promptEl)
  await progressiveText('INITIATING SELF-DESTRUCT SEQUENCE', statusEl)
  blinkBackground(['red', 'black'])
})

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
  for (let idx=0; idx<letters.length; idx++) {
    await delay(50)
    const subtext = letters.slice(0, idx + 1).join('')
    const pad = '*'.repeat(letters.length - idx - 1);
    el.innerText = subtext + pad;
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const hideElement = (el: HTMLElement) => el.style.visibility = 'hidden'

function blinkBackground(colors:string[], interval=500) {
  const [bodyEl]= document.getElementsByTagName('body')!;
  bodyEl.style.backgroundColor = colors[0]
  const intervalId = setInterval(() => {
    colors.push(colors.shift()!)
    bodyEl.style.backgroundColor = colors[0]
  }, interval)

  return () => clearInterval(intervalId)
}