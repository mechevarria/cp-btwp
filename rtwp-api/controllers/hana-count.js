module.exports = (req, res) => {
    const sql = 'SELECT count(*) as "count" FROM badge_location';

    try {
        const results = req.db.exec(sql);

        res.status(200).json({
            results
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: `[SQL Execute error]: ${err.message}`
        });
    }
};
