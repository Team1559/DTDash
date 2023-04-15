export function Size(w, h) {
  return {
    w: w,
    h: h,
    displayName: w + "x" + h,
    dimensions: [w, h]
  }
}

export function AllSizes() {
  let sizes = []
  for (let w = 1; w <= 4; w *= 2) {
    for (let h = 1; h <= 4; h *= 2) {
      sizes.push(new Size(w, h))
    }
  }
  return sizes
}
