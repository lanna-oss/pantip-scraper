import Result from "../models/comments.model";

export const saveSearchResult = async (topic: string, comments: string[]) => {
  const newDocument = {
    topic,
    createDated: new Date().toISOString(),
    updateDated: new Date().toISOString(),
    results: comments,
  };
  let response;
  try {
    response = await Result.create(newDocument);
    return response;
  } catch (error) {
    return response;
  }
};

export const searchForResult = async (keyword: string) => {
  const result = Result.find({ topic: keyword });
  return result;
};
