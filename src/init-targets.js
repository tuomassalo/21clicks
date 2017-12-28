export default function initTargets(
  windowWidth = 1,
  windowHeight = 1,
  targetSize,
) {
  function shuffle(origArray) {
    const a = [].concat(origArray)
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  const center = {x: windowWidth / 2, y: windowHeight / 2}
  const corners = [
    {x: 0, y: 0},
    {x: 0, y: windowHeight},
    {x: windowWidth, y: 0},
    {x: windowWidth, y: windowHeight},
  ]

  const targets = []

  const doneCorners = new Set()

  // go from center to each corner, then from each corner to all unvisited corners
  for (const sourceCorner of shuffle(corners)) {
    targets.push(center)
    for (const destinationCorner of shuffle(corners)) {
      if (
        !doneCorners.has(destinationCorner) &&
        sourceCorner !== destinationCorner
      ) {
        targets.push(sourceCorner, destinationCorner)
      }
      doneCorners.add(sourceCorner)
    }
    targets.push(sourceCorner)
  }
  targets.push(center)

  // Debug the paths
  // center.name = 'C'
  // corners[0].name = '0'
  // corners[1].name = '1'
  // corners[2].name = '2'
  // corners[3].name = '3'
  // const paths = {}
  // let prev = null
  // for (const t of targets) {
  //   if (prev) {
  //     const r = prev.name + t.name
  //     paths[r] = paths[r] || 0
  //     paths[r]++
  //   }
  //   prev = t
  // }
  // console.log(paths)

  // NB: elements of the target array refer to same objects, so we would need to
  // make copies to enable different sizes.
  for (const target of targets) {
    target.size = targetSize
  }

  // return [targets[0], targets[1]]
  return targets
}