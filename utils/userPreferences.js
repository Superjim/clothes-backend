function getUserTags(jsonString, topAndRandom) {
  const obj = JSON.parse(jsonString);

  const topTags = {};
  Object.entries(obj).forEach(([category, tags]) => {
    const n = topAndRandom[category].n;
    const r = topAndRandom[category].r;
    topTags[category] = Object.keys(tags)
      .sort((a, b) => tags[b] - tags[a])
      .slice(0, n);
    for (let i = 0; i < r; i++) {
      const randomTag =
        Object.keys(tags)[Math.floor(Math.random() * Object.keys(tags).length)];
      topTags[category].push(randomTag);
    }
  });

  // Flatten the topTags object into a single array of tags
  const allTags = [].concat(...Object.values(topTags));

  // Return the tags as a comma-separated string
  return allTags.join(", ");
}

module.exports = getUserTags;
