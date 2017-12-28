export default function initTargets(
  windowWidth = 1,
  windowHeight = 1,
  targetSize,
) {
  const m = {x: windowWidth / 2, y: windowHeight / 2}
  const c1 = {x: 0, y: 0}
  const c2 = {x: 0, y: windowHeight}
  const c3 = {x: windowWidth, y: 0}
  const c4 = {x: windowWidth, y: windowHeight}

  const targets = [
    m,
    c1,
    c2,
    c1,
    c4,
    c1,
    c3,
    c1,
    m,
    c2,
    c3,
    c2,
    c4,
    c2,
    m,
    c3,
    c4,
    c3,
    m,
    c4,
    m,
  ]

  // NB: elements of the target array refer to same objects, so we
  // make copies to enable numbering
  const ret = []
  for (const t of targets) {
    t.x = Math.max(targetSize, t.x)
    t.x = Math.min(windowWidth - targetSize, t.x)
    t.y = Math.max(targetSize, t.y)
    t.y = Math.min(windowHeight - targetSize, t.y)
    ret.push({...t, size: targetSize, number: ret.length + 1})
  }
  return ret
}
