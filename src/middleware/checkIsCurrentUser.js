  export default (req, res, next) => {
    const { id } = req.params;

    if (id !== req.user.id) {
      return res.status(403).send({
        error: "Cannot delete this content",
        status: "error"
      });
    }

    next();
};