var fs = require("fs")
var http = require("http")

// Escribí acá tu servidor

 http.createServer((request, response) => {
        const name = request.url.slice(1);
        const files = fs.readdirSync("./images");

        for (const file of files) {
            if (file.includes(name)) {
                response.writeHead(200, { "Content-type": "image/jpg" });
                const img = fs.readFileSync(`./images/${name}_doge.jpg`);
                return response.end(img);
            }
        }
        return response.writeHead(404).end("Not found")
    }).listen(3001, "localhost");



// http.createServer((request, response) => {
//     fs.readFile(`./images${request.url}.jpg`, (error, data) => {
//         if (error) {
//             response.writeHead(404, {"Content-type": "text/plain"})
//             response.end("Image not found")
//         } else {
//             response.writeHead(200, {"Content-type": "image/jpeg"})
//             response.end(data)
//         }
//     })
// }).listen(3003, "localhost")