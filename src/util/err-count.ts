class ErrCount {
  /* 当前错误次数 */
  private errCount = 0;
  /**
   *
   * @param init 初始化错误次数
   */
  public init(init = 0): void {
    this.errCount = init;
  }
  /**
   * 添加错误次数
   */
  public add(): void {
    this.errCount++;
  }
  /**
   * 获取当前错误次数
   */
  public get(): number {
    return this.errCount;
  }
  /**
   * 设置错误次数
   *
   * @param {number} n
   * @memberof ErrCount
   */
  public set(n: number): void {
    this.errCount = n;
  }
}

export const globalErrorCount = new ErrCount();
export const fsSendErrorCount = new ErrCount();
