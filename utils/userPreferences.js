function getUserTags(jsonString) {
  if (!jsonString || jsonString.trim() === "") {
    throw new Error("Invalid preferences JSON input");
  }

  const obj = JSON.parse(jsonString);

  // read in topAndRandom from preferences JSON or use default
  const topAndRandom = obj.topAndRandom || {
    title: { n: 4, r: 0 },
    color: { n: 2, r: 0 },
    brand: { n: 2, r: 0 },
    category: { n: 2, r: 0 },
  };

  //tags object
  const topTags = {};
  Object.entries(obj).forEach(([category, tags]) => {
    if (category === "topAndRandom") {
      return; // skip topAndRandom object
    }
    const n = topAndRandom[category].n;
    const r = topAndRandom[category].r;
    //n = number of tob tags to take
    topTags[category] = Object.keys(tags)
      .sort((a, b) => tags[b] - tags[a])
      .slice(0, n);
    //r = number of random tags to take
    for (let i = 0; i < r; i++) {
      const randomTag =
        Object.keys(tags)[Math.floor(Math.random() * Object.keys(tags).length)];
      topTags[category].push(randomTag);
    }
  });

  // Flatten the topTags object into a single array of tags
  const allTags = [].concat(...Object.values(topTags));

  const output = allTags.join(" ");

  // throw error if output string empty
  if (output === "") {
    throw new Error("User preferences output string is empty");
  }

  console.log(output);

  return output;
}

module.exports = getUserTags;
