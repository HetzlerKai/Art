var
oHttp = require('http'),
fs = require('fs'),
hHome,
hToDo,
hGallery,
fnGetClientAddress;

const PORT=8080;

newFavicon = fs.readFileSync('favicon.ico');
hHome = fs.readFileSync('Home/index.html');
hToDo = fs.readFileSync('ToDo/index.html');
hGallery = fs.readFileSync('Gallery/index.html');

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

        case "/art":
        case "/Art":
        case "/Gallery":
          console.log(sClient + " - requested the Gallery.");
          response.writeHeader(200, {"Content-Type": "text/html"});
          response.write(hGallery);
          response.end();
        break;

        case "/getAllFileNames":
          let aData = fs.readdirSync("C:\\Users\\D061423\\OneDrive - SAP SE\\Documents\\GitHub\\nodejs-Dashboard\\Gallery\\pics");
          response.writeHead(202, {'Content-Type': 'application/json'});
          response.end(JSON.stringify(aData));
        break;

    		case "/favicon.ico":
    			response.writeHead(200, {'Content-Type': 'image/x-icon'});
    			response.end(newFavicon, 'binary');
            break;

            case "/writeToConsole":
                console.log(sOptions);
            break;

            case "/data":
                var sData = fs.readFileSync('Home/data.json');

                response.writeHead(202, {'Content-Type': 'application/json'});
                response.end(sData);
            break;

            case "/writeToFile":

                var
                sLog,
                sTime,
                sMessage;

                sTime = new Date().toLocaleString();
                sOptions = decodeURI(sOptions);
                sLog = "Timestamp: " + sTime + " Text: " + sOptions;

                try {
                    fs.appendFile("Log.txt", "\n" + sLog);
                    sMessage = sClient + " - wrote to Log: " + "\n" + sLog;
                    console.log(sMessage);
                } catch(err) {
                    sMessage = sClient + " - writing to File failed: " + "\n" + err;
                    console.log(sMessage);
                }

                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.end(sMessage);

            break;

            case "/http":
            {
              let sPath = request.url.replace("/http?", "");

              oHttp.get(sPath, (res) => {
                const { statusCode } = res;
                const contentType = res.headers['content-type'];

                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => { rawData += chunk; });
                res.on('end', () => {
                  response.writeHead(200, {'Content-Type': 'application/json'});
                  response.end(rawData);
                });
              }).on('error', (e) => {
                console.error(`Got error: ${e.message}`);
              });
            }
            break;

    		default:
    			var sData = fs.readFileSync("C:\\Users\\D061423\\OneDrive - SAP SE\\Documents\\GitHub\\nodejs-Dashboard\\Gallery" + sRequest);

                response.writeHead(202, {'Content-Type': 'application/json'});
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
oServer.listen(PORT, function(){
    console.log("Server listening on: http://localhost:" + PORT);
    console.log(" ");
    console.log("Hallo Kai...");
    console.log("______________________________________________");
});
