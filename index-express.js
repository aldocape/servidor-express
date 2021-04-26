const express = require("express");

const app = express();

//Inicializo array de usuarios de prueba, simulando datos de una base de datos

let usuarios = [
  {
    id: 1,
    nombre: "Estela",
    apellido: "Gomez",
  },
  {
    id: 2,
    nombre: "Roberto",
    apellido: "Carlos",
  },
  {
    id: 3,
    nombre: "Pipo",
    apellido: "Gorosito",
  },
];

// Esta variable la utilizo como un registro de errores y resultados, para ver qué devuelve cada endpoint y si pudo o no hacer lo que se le pide

let respuesta = {
  error: false,
  codigo: 200,
  mensaje: "",
};

// Aquí arranca el endpoint "listar" de la API

app.get("/api/usuarios/listar", (req, res) => {
  respuesta = {
    error: false,
    codigo: 200, //código 200 = éxito
    mensaje: "Listado de todos los usuarios",
    respuesta: usuarios,
  };

  res.send(respuesta);
});

// Endpoint para crear nuevo usuario
app.post("/api/usuarios/crear", function (req, res) {
  // Falta el valor nombre o apellido, cargo código de error

  if (!req.query.nombre || !req.query.apellido) {
    respuesta = {
      error: true,
      codigo: 501,
      mensaje: "Los campos nombre y apellido son obligatorios",
      respuesta: 0,
    };
  } else {
    // Caso exitoso: Tenemos los datos, ingresamos nuevo usuario en la base de datos
    // Aclaración: Asigno como id la última posición del array, con lo cual
    // es posible que el id quede duplicado, por ejemplo en el caso de que se elimine cualquiera
    // que no sea el último, y luego se agregue un usuario, pero a los fines de hacer un servidor básico, se hace de esta forma

    const count = usuarios.push({
      id: usuarios.length + 1,
      nombre: req.query.nombre,
      apellido: req.query.apellido,
    });

    // Devuelvo código 200 con el array de todos los usuarios para que se vea el cambio

    respuesta = {
      error: false,
      codigo: 200,
      mensaje: `Se ha creado el usuario con id ${count}`,
      respuesta: usuarios,
    };
  }

  res.send(respuesta);
});

// Endpoint para la edición de un usuario

app.put("/api/usuarios/editar", function (req, res) {
  // Verifico que el id venga por url, caso contrario da el error 502 'usuario no especificado'
  if (!req.query.id) {
    respuesta = {
      error: true,
      codigo: 502,
      mensaje: "No se ha especificado el usuario",
    };
  } else {
    // Verifico que la información a modificar no venga en blanco, sino le cargo error 501 'falta dato a modificar'

    if (req.query.nombre === "" && req.query.apellido === "") {
      respuesta = {
        error: true,
        codigo: 501,
        mensaje: "Debe modificar algún dato del usuario",
      };
    } else {
      // tengo el id, tengo algún campo para modificar, asique recorro el Array comparando el id de cada usuario con el que viene por query string

      usuarios.forEach((user) => {
        if (req.query.id == user.id) {
          if (req.query.nombre) {
            user.nombre = req.query.nombre;
          }
          if (req.query.apellido) {
            user.apellido = req.query.apellido;
          }
          // guardo el id modificado, para usar como índice mostrar en respuesta
          modified_id = user.id;
        }
      });
      respuesta = {
        error: false,
        codigo: 200,
        mensaje: "Usuario actualizado",
        respuesta: usuarios[modified_id - 1],
      };
    }
  }
  res.send(respuesta);
});

// Endpoint para eliminar usuario

app.delete("/api/usuarios/eliminar", (req, res) => {
  // Inicializo variable de elemento borrado, para guardar aquí y mostrar en respuesta
  let deleted_item = {};

  // El usuario no especificó id a borrar, cargo error 502 'falta id'
  if (!req.query.id) {
    respuesta = {
      error: true,
      codigo: 502,
      mensaje: "Debe ingresar id de un elemento a eliminar",
    };
  } else {
    // Guardo en variable id el valor del id a buscar, que viene por query string

    let id = req.query.id;
    let count = 0;
    let encontrado = false;

    // Recorro el array comparando el id, para saber la posición que tengo que eliminar, y ahí uso splice, guardando el elemento en la variable deleted_item

    usuarios.forEach((user) => {
      count++;
      if (user.id == id) {
        deleted_item = usuarios.splice(count - 1, 1);
        encontrado = true;
      }
    });

    if (!encontrado) {
      respuesta = {
        error: true,
        codigo: 503,
        mensaje: "El id a eliminar no se encuentra en la base de datos",
        respuesta: deleted_item,
      };
    } else {
      respuesta = {
        error: false,
        codigo: 200,
        mensaje: "Elemento eliminado",
        respuesta: deleted_item,
      };
    }
  }

  res.send(respuesta);
});

app.listen(4000, () => {
  console.info("Atendiendo en el puerto 4000!");
});
