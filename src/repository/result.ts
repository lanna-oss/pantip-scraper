import Result from "../models/comments.model";

export const saveSearchResult = async (keyword: string, topicId: string, comments: string[]) => {
   
  const newDocument = {
    topic: keyword,
    topicId: topicId,
    createDated: new Date().toISOString(),
    updateDated: new Date().toISOString(),
    results: comments,
  };


  let response;
  try {
     response = await Result.findOneAndUpdate({ topicId }, newDocument, {upsert: true , 'new': true })
    console.log(`Succeed ${response}`)
  } catch (error) {
    console.log(`Error ${error}`)
  }
};


export const searchForResult = async (keyword: string) => {
  const result = Result.find({ topic: keyword });
  return result;
};


export const searchForResultWithTopicId = async (topicId: string) => {
  const result = Result.find({ topicId });
  return result;
};
