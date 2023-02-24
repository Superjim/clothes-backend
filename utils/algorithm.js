const ContentBasedRecommender = require("content-based-recommender");
const recommender = new ContentBasedRecommender({
  maxSimilarDocuments: 100,
});
const getUserTags = require("./userPreferences");

const topAndRandom = {
  //n = number of top tags to include
  //r = number of tags at random to inlude
  title: { n: 1, r: 3 },
  color: { n: 1, r: 1 },
  brand: { n: 1, r: 1 },
  category: { n: 1, r: 1 },
};

const formatData = (data, user) => {
  const formattedData = data.map((item) => {
    const tagString =
      item.title +
      " " +
      item.color +
      " " +
      item.category +
      " " +
      item.brand +
      " " +
      item.gender;
    return { id: item.clothes_id, content: tagString };
  });
  formattedData.push({
    id: user.uid,
    content: getUserTags(user.preferences, topAndRandom),
  });

  return formattedData;
};

const suggestionAlgorithmFunc = (data, user) => {
  const formattedItems = formatData(data, user);

  //this is the timesink
  recommender.train(formattedItems);

  const similarItems = recommender.getSimilarDocuments(user.uid, 0, 10);

  return similarItems;
};

module.exports = { suggestionAlgorithmFunc };
