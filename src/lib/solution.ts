type SuccessHandler = () => void;
type FailureHandler = () => void

type HandlerDict = {
  success: SuccessHandler[],
  failure: FailureHandler[],
}

type Handler<T extends keyof HandlerDict> = HandlerDict[T][number]


export class Solution {

  private handlers: HandlerDict = {
    success: [],
    failure: []
  }

  constructor(private solution: string = 'EXPERIMENT') {
    this.addEventListener('success', () => console.log('success'))
    this.addEventListener('failure', () => console.log('failure'))
  }

  public check(val: string) {
    if (val.toLocaleLowerCase() === this.solution.toLowerCase()) {
      this.emitEvent('success')
    } else {
      this.emitEvent("failure")
    }
  }

  public addEventListener<T extends keyof HandlerDict>(event: T, handler: Handler<T>) {
    this.handlers[event].push(handler)
  }

  private emitEvent(event: keyof HandlerDict) {
    this.handlers[event].forEach(handler => handler())
  }
}