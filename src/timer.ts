type StartHandler = () => void
type TickHandler = (timeRemaining: number) => void;
type StopHandler = () => void
type ExpireHandler = () => void

type HandlerDict = {
  start: StartHandler[]
  tick: TickHandler[],
  stop: StopHandler[],
  expire: ExpireHandler[]
}

type Handler<T extends keyof HandlerDict> = HandlerDict[T][number]

export class Timer {
  private interval: number | null = null;
  private deactivated = false;

  private handlers: HandlerDict = {
    start: [],
    tick: [],
    stop: [],
    expire: []
  }

  constructor(private timeRemaining: number = 3600) {
    this.addEventListener('start', () => console.log('start'))
    this.addEventListener('tick', console.log)
    this.addEventListener('stop', () => console.log('stop'))
    this.addEventListener('expire', () => console.log('expire'))

    setTimeout(() => this.emitEvent('tick'))
  }

  public start() {
    if (this.interval || this.deactivated) return
    
    this.emitEvent('start')
    this.interval = setInterval(() => {
      this.timeRemaining -= 1;
      this.emitEvent('tick');

      if (this.timeRemaining === 0) {
        this.emitEvent('expire')
        this.stop()
      }
    }, 1000);
  }

  public stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.deactivated) {
      return
    }

    this.interval = null;
    this.emitEvent('stop')
  }

  public deactivate() {
    this.deactivated = true;
    this.stop()
  }

  public addEventListener<T extends keyof HandlerDict>(event: T, handler: Handler<T>) {
    // @ts-expect-error
    this.handlers[event].push(handler)
  }

  private emitEvent(event: keyof HandlerDict) {
    if (event === 'tick') {
      this.handlers.tick.forEach(handler => handler(this.timeRemaining))
    } else {
      this.handlers[event].forEach(handler => handler())
    }
  }
}
