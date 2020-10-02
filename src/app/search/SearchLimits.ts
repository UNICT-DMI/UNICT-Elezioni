export default class SearchLimits {
  private _maxResults: number;
  private currentResults: number;

  constructor(maxResults: number) {
    this._maxResults = maxResults;
    this.currentResults = 0;
  }

  reset(): void {
    this.currentResults = 0;
  }

  increaseResults(): void {
    this.currentResults++;
  }

  isFull(): boolean {
    return this.currentResults >= this._maxResults;
  }
}
