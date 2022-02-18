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

exports.customErrorMsgs = (data, len, theKey, theValue) => {
  const extraKeys = Object.entries(theKey).length < len;
  const arrayOr = (arr) => {
    return arr.reduce((ans, el) => {
      ans ||= el;
      return ans;
    }, false);
  };
  const isMisspeltKey = Object.keys(data).reduce((isMispelt, el, idx) => {
    if (el !== theKey[idx]) {
      isMispelt.push(true);
    } else {
      isMispelt.push(false);
    }
    return isMispelt;
  }, []);
  const misspeltKey = arrayOr(isMisspeltKey);
  const noKey = Object.keys(data).length === 0;
  const isIncorrectDataType = Object.values(data).reduce(
    (isIncorrent, el, idx) => {
      if (typeof el !== theValue[idx]) {
        isIncorrent.push(true);
      } else {
        isIncorrent.push(false);
      }
      return isIncorrent;
    },
    []
  );
  const incorrectDataType = arrayOr(isIncorrectDataType);

  const badRequestMessage = misspeltKey || noKey || incorrectDataType;
  if (extraKeys) {
    return ["Forbidden", 403];
  }
  if (badRequestMessage) {
    return ["Bad Request", 400];
  }
  return [undefined, undefined];
};

exports.sortByIsValid = (sort_by) => {
  const articles = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    undefined,
  ];
  return articles.reduce((isSortByExists, column) => {
    if (column === sort_by) {
      isSortByExists = true;
    }
    return isSortByExists;
  }, false);
};

exports.orderIsValid = (order) => {
  return !(order !== "ASC" && order !== "DESC" && order !== undefined);
};

exports.invalidQuery = (data) => {
  return (
    Object.keys(data).length !==
    Object.keys(data).reduce((counter, property) => {
      if (
        property === "sort_by" ||
        property === "order" ||
        property === "topic"
      ) {
        counter++;
      }
      return counter;
    }, 0)
  );
};
