export default class Size {
  constructor(w, h, displayName) {
    return {
      w: w,
      h: h,
      displayName: displayName || (w + "x" + h),
      dimensions: [w, h]
    }
  }
  static AllSizes() {
    return [
      new Size(2, 2, "tiny"),
      new Size(3, 2, "small"),
      new Size(4, 3, "medium"),
      new Size(5, 4, "large"),
    ]
  }
}
