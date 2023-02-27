function getUserTags(jsonString, topAndRandom) {
  //check json string exists
  if (!jsonString || jsonString.trim() === "") {
    throw new Error("Invalid preferences JSON input");
  }

  // check tags are requested
  const hasTags = Object.keys(topAndRandom).some(
    (category) => topAndRandom[category].n + topAndRandom[category].r > 0
  );

  if (!hasTags) {
    throw new Error("No tags requested, please check topAndRandom object");
  }

  const obj = JSON.parse(jsonString);

  //tags object
  const topTags = {};
  Object.entries(obj).forEach(([category, tags]) => {
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
