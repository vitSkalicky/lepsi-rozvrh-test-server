var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");

const sep = path.sep;
const root = "." + sep + "responses" + sep;

http
  .createServer(function(req, res) {
    try {
      var q = url.parse(req.url, true).query;

      if (q.gethx != undefined) {
        sendFile(res, "gethx.xml");
      } else if (q.pmd != undefined) {
        var pmd = q.pmd.replace("/[^a-z0-9+]+/gi", "");
        var pm = q.pm.replace("/[^a-z0-9+]+/gi", "");

        fs.exists(root + pm + sep + pmd + ".xml", function(exists) {
          try {
            if (exists) {
              sendFile(res, pm + sep + pmd + ".xml");
            } else {
              sendFile(res, pm + sep + pm + ".xml");
            }
          } catch (error) {
            console.log(error);
            res.writeHead(404);
            res.end('404');
        }
        });
      } else {
        var pm = q.pm.replace("/[^a-z0-9+]+/gi", "");
        sendFile(res, pm + ".xml");
      }
      console.log("served: " + q.pm + ", " + q.pmd);
    } catch (error) {
      console.log(error);
      res.writeHead(404);
      res.end('404');
    }

    /*
  if (q.gethx != undefined){
    sendFile(res, 'gethx.xml')
  } else if (q.pm == 'login'){
    sendFile(res, 'login.xml')
  } else if (q.pm == 'interfaces'){
    sendFile(res, 'interfaces.xml')
  } else if (q.pm == ''){
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end('')
  } else if (q.pm == 'znamky'){
    sendFile(res, 'znamky.xml')
  } else if (q.pm == 'prijate'){
      sendFile(res, 'prijate.xml')
    } else if (q.pm == 'ukoly'){
    sendFile(res, 'ukoly.xml')
  } else if (q.pm == 'rozvrh' || q.pm == 'ucitelrozvrh'){
    if (q.pmd == 'perm'){
      sendFile(res, 'rozvrh-perm.xml')
    } else{
      sendFile(res, 'rozvrh.xml')
    }
  } else{
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end('Hello World')
  }      */
  })
  .listen(8080);
console.log("running...");

function sendFile(res, filename) {
  fs.readFile(root + filename, function(err, data) {
    try {
      if (data == undefined || data == null) {
        res.writeHead(404);
        res.end('404');
      } else {
        res.writeHead(200, { "Content-Type": "text/xml" });
        res.write(data);
        res.end();
        console.log("served file: " + filename);
      }
    } catch (error) {
      console.log(error);
      res.writeHead(404);
      res.end('404');
    }
  });
}
