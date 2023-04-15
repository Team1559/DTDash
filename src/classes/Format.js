export function topicDisplayString(topic) {
  const parts = topic.split("/")
  return parts.slice(2).join("/")
}
