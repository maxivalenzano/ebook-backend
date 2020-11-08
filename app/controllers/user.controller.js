exports.allAccess = (req, res) => {
    res.status(200).send("Contenido público");
  };

exports.userBoard = (req, res) => {
    res.status(200).send("Contenido para usuarios");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Contenido para Administradores");
};

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Contenido para Moderadores");
};