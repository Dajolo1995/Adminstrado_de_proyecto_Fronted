const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');

exports.crearUsario = async (req, res) => {
  //Revisar si hay error
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  //extraer email & password
  const { email, password } = req.body;

  try {
    //Revisar que el usuario sea unico
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }
    //Creando el nuevo usuario
    usuario = new Usuario(req.body);

    //Hashear el password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);

    //Guardando el nuevo usurio
    await usuario.save();

    // Crear y firmar el jwt
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };
    // Firmar el jwt
    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: 3600,
      },
      (error, token) => {
        if (error) throw error;

        //Mensaje de confirmacion
        res.json({ token: token });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send("Hubo un error");
  }
};
