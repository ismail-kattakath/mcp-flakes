export class Budget {
  private used = 0;
  constructor(public readonly maxTokens: number) {}
  add(n: number): void {
    this.used += n;
  }
  get tokensUsed(): number {
    return this.used;
  }
  get exceeded(): boolean {
    return this.used >= this.maxTokens;
  }
}
