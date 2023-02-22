const ContentBasedRecommender = require("content-based-recommender");
const recommender = new ContentBasedRecommender({
  maxSimilarDocuments: 100,
});

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
  formattedData.push({ id: user.uid, content: user.preferences });

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
