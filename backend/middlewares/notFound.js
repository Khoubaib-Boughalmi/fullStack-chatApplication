const notFound = (req, res, next) => {
    res.status(404).json({message: `Page ${req.originalUrl} Not Found`});
    next();
}

module.exports = { notFound };