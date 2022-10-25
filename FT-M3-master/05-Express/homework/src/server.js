// const bodyParser = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

let id = 1;

// TODO: your code to handle requests

// RUTA POST
server.post("/posts", (request, response) => {
  const { author, title, contents } = request.body;

  if (!author || !title || !contents) {
    return response.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para crear el Post",
    });
  }
  const newPost = {
    id: id++,
    author,
    title,
    contents,
  };

  posts.push(newPost);
  return response.status(200).json(newPost);
});

// RUTA POST
server.post("/posts/author/:author", (request, response) => {
  const { title, contents } = request.body;
  const { author } = request.params;

  if (!author || !title || !contents) {
    return response.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para crear el Post",
    });
  }

  const newPost = {
    id: id++,
    author,
    title,
    contents,
  };

  posts.push(newPost);
  return response.status(200).json(newPost);
});

// RUTA GET
server.get("/posts", (request, response) => {
  const { term } = request.query;

  //si tengo term -> voy a buscar
  if (term) {
    const result = posts.filter((post) => {
      return post.title.includes(term) || post.contents.includes(term);
    });
    return response.status(200).json(result);
  } else {
    // si no tengo term -> voy a mandar todo
    return response.status(200).json(posts);
  }
});

// RUTA GET
server.get("/posts/:author", (request, response) => {
  const { author } = request.params;
  const result = posts.filter((post) => {
    return post.author === author;
  });

  if (result.length !== 0) {
    // tengo posts
    return response.status(200).json(result);
  } else {
    // no tengo posts
    return response
      .status(STATUS_USER_ERROR)
      .json({ error: "No existe ningun post del autor indicado" });
  }
});

//RUTA GET
server.get("/posts/:author/:title", (request, response) => {
  const { author, title } = request.params;
  const result = posts.filter((post) => {
    return post.author === author && post.title === title;
  });
  // tengo posts
  if (result.length) {
    return response.status(200).json(result);
  } else {
    //no tengo posts
    return response.status(STATUS_USER_ERROR).json({
      error: "No existe ningun post con dicho titulo y autor indicado",
    });
  }
});

//RUTA PUT
server.put("/posts", (request, response) => {
  const { id, title, contents } = request.body;

  if (!id || !title || !contents)
    return response.status(STATUS_USER_ERROR).json({
      error:
        "No se recibieron los parámetros necesarios para modificar el Post",
    });

  //find un solo elemento devuelve, el filter un array de elem
  const post = posts.find((post) => post.id === +id);
  //parseint, Number etc

    // el find es una referencia del objeto, se modifica todas las variables que apuntan a ese obj.
  if (post) {
    //si existe, encontre post con ese id
    post.title = title;
    post.contents = contents;
    return response.status(200).json(post);
  } else {
    //no tengo posts, no encontre post con ese id
    return response
      .status(STATUS_USER_ERROR)
      .json({ error: "No existe el Post con ese ID que se quiere modificar" });
  }
});

// DELETE
server.delete("/posts", (request, response) => {
  const { id } = request.body;

  const post = posts.find((post) => post.id === +id);

  if (!id || !post)
    response.status(STATUS_USER_ERROR).json({ error: "Mensaje de error" });

  posts = posts.filter((post) => post.id !== id);

  return response.status(200).json({ success: true });
});

//DELETE
server.delete("/author", (request, response) => {
  const { author } = request.body;
 // se usa filter porque estamos buscando todos los posts del author.. en el find es solo 1 un id que estabamos buscando.
  const authorPosts = posts.filter((post) => post.author === author);

  if (!author || !authorPosts.length)
   return response
      .status(STATUS_USER_ERROR)
      .json({ error: "No existe el autor indicado" });

  posts = posts.filter((post) => post.author !== author);

  return response.status(200).json(authorPosts);
});

module.exports = { posts, server };

// TENIAMOS 3 FORMAS DE MANDAR LA INFO EN LA REQUEST
// 1. PARAMS - URL - nueva ruta -/users/:id
// 2. QUERYS - URL - no hay ruta nueva - users?name=Erika
// 3. BODY - SERVER

//son rutas distintas
// /users
// /users/1

//las mismas rutas
// /users - si no tengo query traeme todos los usarios
// /users?name=Erika - si tengo query traeme los usuarios de name Erika
