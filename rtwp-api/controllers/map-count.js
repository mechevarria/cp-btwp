const dateUtil = require('./date-util');

module.exports = (req, res) => {
  const defaults = dateUtil.getDefaults();

  const start = req.query.start || defaults.start;
  const end = req.query.end || defaults.end;

  const sql = `
    SELECT 
        count(*) AS "count",
        MIN(SEEN_TS) AS "min",
        MAX(SEEN_TS) AS "max"
    FROM CV_BADGE_LOCATION
    WHERE SEEN_TS >= TO_TIMESTAMP( ?, 'YYYY-MM-DD' ) AND SEEN_TS <= TO_TIMESTAMP( ?, 'YYYY-MM-DD' )`;

  try {
    const result = req.db.exec(sql, [start, end])[0];

    res.status(200).json({
      result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: `[SQL Execute error]: ${err.message}`
    });
  }
};
