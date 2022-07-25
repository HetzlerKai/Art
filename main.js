var
oHttp = require('http'),
fs = require('fs'),
hGallery, hLeak, fnGetClientAddress;
var mobile = require('is-mobile');

const PORT=8080;

newFavicon = fs.readFileSync('favicon.ico');
hLeak = fs.readFileSync('PRJ_LEAK/index.html');
hGallery = fs.readFileSync('Gallery/index.html');
dir = "";

fnGetClientAddress = function (req) {
        return (req.headers['x-forwarded-for'] || '').split(',')[0]
        || req.connection.remoteAddress;
};

function handleRequest(request, response){

    var
    sOptions = request.url.split("?")[1],
    sRequest = request.url.split("?")[0],
    sClient = fnGetClientAddress(request);

    try {
        switch(sRequest){

        case ".well-known/acme-challenge/8JO_766eeT6w4tDMggz4_asO_A8t9OuYZ9tBVww2zC4":
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end('8JO_766eeT6w4tDMggz4_asO_A8t9OuYZ9tBVww2zC4.qA_1M3nn-DZ4tARocoZWx9N_doHj1W6cV2cXkLFXEE0');
        break;

        case "/":
        case "/art":
        case "/Art":
        case "/v2":
          dir = "PRJ_LEAK";
          console.log(sClient + " - requested the Leak.");
          response.writeHeader(200, {"Content-Type": "text/html"});
          response.write(hLeak);
          response.end();
        break;

        case "/Gallery":
          dir = "Gallery";
          console.log(sClient + " - requested the Gallery.");
          response.writeHeader(200, {"Content-Type": "text/html"});
          response.write(hGallery);
          response.end();
        break;

        case "/getAllFileNames":
          let aData = fs.readdirSync(dir + "/pics");
          response.writeHead(202, {'Content-Type': 'application/json'});
          response.end(JSON.stringify(aData));
        break;

        case "/getDataFile":
          let sPicsData = fs.readFileSync(dir + '/pics.json', 'utf8');

          response.writeHead(202, {'Content-Type': 'application/json'});
          response.end(sPicsData);
        break;

    		case "/favicon.ico":
    			response.writeHead(200, {'Content-Type': 'image/x-icon'});
    			response.end(newFavicon, 'binary');
        break;

    		default:
          //crutch for old version
          if (sRequest.startsWith("Gallery")) {
            dir = '';
          }
    			var sData = fs.readFileSync(dir + sRequest);

          response.writeHead(200, {'Content-Type': 'application/json'});
          response.end(sData);
    		break;
        }
    } catch(err) {
        console.log(err);
        response.writeHead(400, {'Content-Type': 'text/plain'});
        response.end('Error:' + err);
    }
}

var oServer = oHttp.createServer(handleRequest);
oServer.listen(process.env.PORT || 5000, function(){
    console.log("Server listening on: http://localhost:" + PORT);
    console.log(" ");
    console.log("Hallo Kai...");
    console.log("______________________________________________");
});
