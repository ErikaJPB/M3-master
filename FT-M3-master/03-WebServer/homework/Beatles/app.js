var http = require('http');
var fs   = require('fs');

var beatles=[{
  name: "John Lennon",
  birthdate: "09/10/1940",
  profilePic:"https://blogs.correiobraziliense.com.br/trilhasonora/wp-content/uploads/sites/39/2020/10/CBNFOT081020100047-550x549.jpg"
},
{
  name: "Paul McCartney",
  birthdate: "18/06/1942",
  profilePic:"http://gazettereview.com/wp-content/uploads/2016/06/paul-mccartney.jpg"
},
{
  name: "George Harrison",
  birthdate: "25/02/1946",
  profilePic:"https://canaldosbeatles.files.wordpress.com/2012/02/george-george-harrison-8321345-438-600.jpg"
},
{
  name: "Richard Starkey",
  birthdate: "07/08/1940",
  profilePic:"http://cp91279.biography.com/BIO_Bio-Shorts_0_Ringo-Starr_SF_HD_768x432-16x9.jpg"
}
]


http.createServer((request, response) => {

  if(request.url === "/" ) {
    const index = fs.readFileSync("./index.html");

    response.writeHead(200, {"Content-type":"text/html"})
    return response.end(index)
  }
  
  const myUrl = request.url.split("/");
  
  if (myUrl.length < 3  && !myUrl.includes('api')) {
    const beatleName = myUrl[1].replace("%20", " "); // decodeURI quita el %20 // encodeURI
    const OneBeatle = beatles.filter((elem) => elem.name === beatleName)[0] // para que devuelva solo el objeto


    let template = fs.readFileSync("./beatle.html", "utf-8")
    template = template.replace("{name}", OneBeatle.name)
    template = template.replace("{birthdate}", OneBeatle.birthdate)
    template = template.replace("{image}", OneBeatle.profilePic)
    
    response.writeHead(200, {"Content-type":"text/html"})
    return response.end(template)
  }


  if (request.url === "/api") {
   response.writeHead(200, { "Content-type":"application/json"})
   return response.end(JSON.stringify(beatles));
  }

  const beatleName = request.url.split("/").pop().replace("%20", " ") 
  if (request.url.includes("/api") && beatleName) {
    const OneBeatle = beatles.filter((elem) => elem.name === beatleName);

    if (!OneBeatle.length) {
    response.writeHead(404, {"Content-type": "text/plain"})
    return response.end("Beatle not found")
  }
    response.writeHead(200, { "Content-type": "application/json"})
    return response.end(JSON.stringify(OneBeatle[0]))
  }
  
}).listen(3002, "localhost")