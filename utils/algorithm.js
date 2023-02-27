const ContentBasedRecommender = require("content-based-recommender");
const recommender = new ContentBasedRecommender({
  maxSimilarDocuments: 100,
});
const getUserTags = require("./userPreferences");

const topAndRandom = {
  //n = number of top tags to include
  //r = number of tags at random to inlude
  title: { n: 2, r: 2 },
  color: { n: 2, r: 0 },
  brand: { n: 0, r: 0 },
  category: { n: 0, r: 0 },
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
