exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};

exports.convertDateToTimestamp = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  let dbDate = new Date(created_at);
  let offset = dbDate.getTimezoneOffset() * 60 * 1000;
  let millisecondsDate = dbDate.getTime() - offset;
  return { created_at: millisecondsDate, ...otherProperties };
};

exports.customPatchErrorMsgs = (data) => {
  const extraKeysOnThePatch = Object.entries(data).length > 1;
  const misspeltKeyOnThePatch = Object.keys(data)[0] !== "inc_votes";
  const noKeyOnThePatch = Object.keys(data).length === 0;
  const incorrectDataTypeOnThePatch =
    typeof Object.values(data)[0] !== "number";
  const badRequestMessage =
    misspeltKeyOnThePatch || noKeyOnThePatch || incorrectDataTypeOnThePatch;
  if (extraKeysOnThePatch) {
    return ["Forbidden", 403];
  }
  if (badRequestMessage) {
    return ["Bad Request", 400];
  }
  return [undefined, undefined];
};
