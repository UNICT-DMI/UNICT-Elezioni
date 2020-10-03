export default class SearchLimits {
  private _maxResults: number | undefined;
  private currentResults = 0;

  setLimit(maxResults: number | undefined): void {
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
    return this._maxResults !== undefined && this.currentResults >= this._maxResults;
  }
}
