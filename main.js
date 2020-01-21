var
oHttp = require('http'),
fs = require('fs'),
img,
hHome,
hToDo,
hGallery,
fnGetClientAddress;

const PORT=8080;

img = fs.readFileSync('favicon_old.ico');
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

        case "/Time":
        case "/time":
                console.log(sClient + " - requested the Servertime.");
        	    response.writeHead(200, {'Content-Type': 'text/plain'});
    			response.end('Time:' + new Date().toLocaleString());
    		break;

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

        case "/todo":
          console.log(sClient + " - requested the To Do List.");
          response.writeHeader(200, {"Content-Type": "text/html"});
          response.write(hToDo);
          response.end();
        break;

        case "/ToDoData":
        {
            let sData = fs.readFileSync('ToDo/ToDoList.json');

            response.writeHead(202, {'Content-Type': 'application/json'});
            response.end(sData);
        }
        break;

        case "/addToDoItem":
        {
          let
          oResponseData, sNewData, oWriteResponse,
          oNewItem = JSON.parse(decodeURI(sOptions));

          console.log("Add new Item:");
          console.log(oNewItem);

          //read exsiting data
          oResponseData = JSON.parse(fs.readFileSync('ToDo/ToDoList.json', 'utf8'));
          if (oResponseData && oResponseData.items) {

            //build new entry
            oNewItem.Id = oResponseData.nextId;
            oResponseData.nextId++;
            oResponseData.items.push(oNewItem);
            sNewData = JSON.stringify(oResponseData);

            //write new entry
            fs.writeFileSync('ToDo/ToDoList.json', sNewData, 'utf8');

            //responde with new data
            response.writeHead(202, {'Content-Type': 'application/json'});
            response.end(sNewData);

          } else {
            response.writeHead(400, {'Content-Type': 'application/json'});
            response.end("Add Failed");
          }
        }
        break;

        case "/updateToDOItem":
        {
          let i, iId, oUpdateData;

          oUpdateData = JSON.parse(decodeURI(sOptions));
          iId = oUpdateData.Id;

          oResponseData = JSON.parse(fs.readFileSync('ToDo/ToDoList.json', 'utf8'));
          if (oResponseData && oResponseData.items) {

            //update entry
            for (i = 0; i < oResponseData.items.length; i++) {
              if (oResponseData.items[i] && oResponseData.items[i].Id == iId) {
                oResponseData.items[i].Description = oUpdateData.Description;
              }
            }
            sNewData = JSON.stringify(oResponseData);

            //write new data
            fs.writeFileSync('ToDo/ToDoList.json', sNewData, 'utf8');

            //responde with new data
            response.writeHead(202, {'Content-Type': 'application/json'});
            response.end(sNewData);

          } else {
            response.writeHead(400, {'Content-Type': 'application/json'});
            response.end("Add Failed");
          }
        }
        break;

        case "/setBlockedOfToDoItem":
        {
          let i, iId, oUpdateData;

          oUpdateData = JSON.parse(decodeURI(sOptions));
          iId = oUpdateData.Id;

          oResponseData = JSON.parse(fs.readFileSync('ToDo/ToDoList.json', 'utf8'));
          if (oResponseData && oResponseData.items) {

            //update entry
            for (i = 0; i < oResponseData.items.length; i++) {
              if (oResponseData.items[i] && oResponseData.items[i].Id == iId) {
                oResponseData.items[i].Blocked = oUpdateData.Blocked;
                oResponseData.items[i].BlockedBy = oUpdateData.BlockedBy;
              }
            }
            sNewData = JSON.stringify(oResponseData);

            //write new data
            fs.writeFileSync('ToDo/ToDoList.json', sNewData, 'utf8');

            //responde with new data
            response.writeHead(202, {'Content-Type': 'application/json'});
            response.end(sNewData);

          } else {
            response.writeHead(400, {'Content-Type': 'application/json'});
            response.end("Add Failed");
          }
        }
        break;

        case "/deleteToDoItem":
        {
          let
          aRemoved,
          iId = decodeURI(sOptions);

          oResponseData = JSON.parse(fs.readFileSync('ToDo/ToDoList.json', 'utf8'));
          if (oResponseData && oResponseData.items) {

            //update entry
            for (i = 0; i < oResponseData.items.length; i++) {
              if (oResponseData.items[i] && oResponseData.items[i].Id == iId) {
                aRemoved = oResponseData.items.splice(i, 1);
              }
            }

            if (aRemoved && aRemoved.length > 1) {
              console.log("To many Items to be deleted, stop execution");
              return;
            }

            sNewData = JSON.stringify(oResponseData);

            //write new data
            fs.writeFileSync('ToDo/ToDoList.json', sNewData, 'utf8');

            //responde with new data
            response.writeHead(202, {'Content-Type': 'application/json'});
            response.end(sNewData);

          } else {
            response.writeHead(400, {'Content-Type': 'application/json'});
            response.end("Add Failed");
          }
        }
        break;

        case "/setTaskOfToDoItem":
        {
          let i, iId, oUpdateData;

          oUpdateData = JSON.parse(decodeURI(sOptions));
          iId = oUpdateData.Id;

          oResponseData = JSON.parse(fs.readFileSync('ToDo/ToDoList.json', 'utf8'));
          if (oResponseData && oResponseData.items) {

            //update entry
            for (i = 0; i < oResponseData.items.length; i++) {
              if (oResponseData.items[i] && oResponseData.items[i].Id == iId) {
                oResponseData.items[i].Tasks = oUpdateData.Tasks;
                if (oUpdateData.Link) {
                  oResponseData.items[i].Link = oUpdateData.Link;
                }
              }
            }
            sNewData = JSON.stringify(oResponseData);

            //write new data
            fs.writeFileSync('ToDo/ToDoList.json', sNewData, 'utf8');

            //responde with new data
            response.writeHead(202, {'Content-Type': 'application/json'});
            response.end(sNewData);

          } else {
            response.writeHead(400, {'Content-Type': 'application/json'});
            response.end("Add Failed");
          }
        }
        break;

        case "/togglePrioOfToDo":
        {
          let i, iId, oUpdateData;

          iId = sOptions;

          oResponseData = JSON.parse(fs.readFileSync('ToDo/ToDoList.json', 'utf8'));
          if (oResponseData && oResponseData.items) {

            //update entry
            for (i = 0; i < oResponseData.items.length; i++) {
              if (oResponseData.items[i] && oResponseData.items[i].Id == iId) {
                if (oResponseData.items[i].Critical) {
                  oResponseData.items[i].Critical = false;
                  oResponseData.items[i].Uncritical = true;
                } else {
                  oResponseData.items[i].Critical = true;
                  oResponseData.items[i].Uncritical = false;
                }
              }
            }
            sNewData = JSON.stringify(oResponseData);

            //write new data
            fs.writeFileSync('ToDo/ToDoList.json', sNewData, 'utf8');

            //responde with new data
            response.writeHead(202, {'Content-Type': 'application/json'});
            response.end(sNewData);

          } else {
            response.writeHead(400, {'Content-Type': 'application/json'});
            response.end("Add Failed");
          }
        }
        break;

        case "/togglePrioLowOfToDo":
        {
          let i, iId, oUpdateData;

          iId = sOptions;

          oResponseData = JSON.parse(fs.readFileSync('ToDo/ToDoList.json', 'utf8'));
          if (oResponseData && oResponseData.items) {

            //update entry
            for (i = 0; i < oResponseData.items.length; i++) {
              if (oResponseData.items[i] && oResponseData.items[i].Id == iId) {
                if (oResponseData.items[i].Uncritical) {
                  oResponseData.items[i].Uncritical = false;
                } else {
                  oResponseData.items[i].Uncritical = true;
                  oResponseData.items[i].Critical = false;
                }
              }
            }
            sNewData = JSON.stringify(oResponseData);

            //write new data
            fs.writeFileSync('ToDo/ToDoList.json', sNewData, 'utf8');

            //responde with new data
            response.writeHead(202, {'Content-Type': 'application/json'});
            response.end(sNewData);

          } else {
            response.writeHead(400, {'Content-Type': 'application/json'});
            response.end("Add Failed");
          }
        }
        break;

        case "/":
        case "/home":
        case "/Home":
            console.log(sClient + " - requested the Dashboard.");
    			  response.writeHeader(200, {"Content-Type": "text/html"});
        		response.write(hHome);
        		response.end();
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
