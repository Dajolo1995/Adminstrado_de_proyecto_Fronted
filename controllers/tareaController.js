const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

//Crea una nueva tarea

exports.crearTarea = async (req, res) => {
  //Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    //Extraer el proyecto y comprobar si existe
    const { proyecto } = req.body;

    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //Revisando si el proyecto actual pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //Creado tarea
    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Obtiene las tareas por proyecto
exports.obtenerTarea = async (req, res) => {

  try {
    //Extraer el proyecto y comprobar si existe
    const { proyecto } = req.query;

    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //Revisando si el proyecto actual pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //Obener la tarea por proyecto
    const tareas = await Tarea.find({ proyecto });
    res.json({ tareas });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Actualizar una tareas
exports.actualizarTarea = async (req, res) => {
  try {
    //Extraer el proyecto y comprobar si existe
    const { proyecto, nombre, estado } = req.body;

    //Crear si la tarea existe
    let tarea = await Tarea.findById(req.params.id)
    if(!tarea){
      return res.status(404).json({msg: 'No existe esa tarea'})
    }

    const existeProyecto = await Proyecto.findById(proyecto);

    //Revisando si el proyecto actual pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }


    // Crear un objeto con la nueva información
    const nuevaTarea = {};
      nuevaTarea.nombre = nombre;
      nuevaTarea.estado = estado;
 

    //Guardar la tarea
    tarea = await Tarea.findByIdAndUpdate({_id: req.params.id }, nuevaTarea, {new: true})

    res.json({tarea})

  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Eliminando una tarea

exports.eliminartarea = async (req, res) =>{

  try {
        //Extraer el proyecto y comprobar si existe
        const { proyecto } = req.query;

        //Crear si la tarea existe
        let tarea = await Tarea.findById(req.params.id)
        if(!tarea){
          return res.status(404).json({msg: 'No existe esa tarea'})
        }
    
        const existeProyecto = await Proyecto.findById(proyecto);
    
        //Revisando si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
          return res.status(401).json({ msg: "No autorizado" });
        }
        
        //eliminando
        await Tarea.findOneAndRemove ({_id: req.params.id});
        res.json({msg: 'Tarea eliminada'})
        
    
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error"); 
  }
}
