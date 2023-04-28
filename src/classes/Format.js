export function topicDisplayString(topic) {
  const parts = topic.split("/")
  return parts.slice(2).join("/")
}

export function commonPrefix(topics) {
  if (topics.length < 2) {
    // No common prefix for a single topic
    return ""
  }
  let longestArray = topics[0].split("/")
  for (var topic of topics.slice(1)) {
    let currentArray = topic.split("/")
    let i = 0

    for (i = 0; i < Math.min(currentArray.length, longestArray.length); i++) {
      if (longestArray[i] != currentArray[i]) {
        break
      }
    }
    longestArray = longestArray.slice(0, i)
  }
  return longestArray.join("/")
}

export function trimPrefix(str, prefix) {
  if (str.startsWith(prefix)) {
    return str.slice(prefix.length)
  } else {
    return str
  }
}
