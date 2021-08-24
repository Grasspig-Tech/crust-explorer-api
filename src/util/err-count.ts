class ErrCount {
  /* 当前错误次数 */
  private errCount = 0;
  /**
   *
   * @param init 初始化错误次数
   */
  init(init = 0): void {
    this.errCount = init;
  }
  /**
   * 添加错误次数
   */
  add(): void {
    this.errCount++;
  }
  /**
   * 获取当前错误次数
   */
  get(): number {
    return this.errCount;
  }
  /**
   * 设置错误次数
   *
   * @param {number} n
   * @memberof ErrCount
   */
  set(n: number): void {
    this.errCount = n;
  }
}

export const globalErrorCount = new ErrCount();
export const fsSendErrorCount = new ErrCount();
