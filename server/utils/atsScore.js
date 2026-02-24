
export const calculateATSScore = (jdKeywords, resumeKeywords) => {
  const uniqueJD = [...new Set(jdKeywords)];

  const matches = uniqueJD.filter(k =>
    resumeKeywords.includes(k)
  );

  return Math.round((matches.length / uniqueJD.length) * 100);
};