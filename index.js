const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const PORT = 8080;

const server = http.createServer((req, res) => {
  if (req.url === "/signup" && req.method === "GET") {
    res.writeHead(200, { Content: "text/html" });
    res.end(`<!DOCTYPE html>
<html lang="en">

<head>

    <title>Signup Form</title>
</head>

<body>
    <form action="/signup" method="post">
        <h2>Signup Form</h2>
        UserName: <input type="text" name="username" id="username" required />
        Password: <input type="password" name="password" id="password" required />
        <input type=" submit" value="Signup" />

    </form>
</body>

</html>`);
  } else if (req.url === "/signup" && req.method === "POST") {
    //collect  and parse form data(post request)
    let body = ""; // to accumulate the chunks
    req.on("data", (chuck) => {
      body += chuck.toString(); //Each chunk of data is appended to 'body'
    });
    res.on("end", () => {
      //one all the data has been received
      const { username, password } = qs.parse(body);

      // Store username and password in user.txt
      fs.appendFile(
        "user.txt",
        `Username : ${username} Password: ${password}\n`,
        (err, data) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error in saving user");
          } else {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Thank You for Signup...!!!");
          }
        }
      );
    });
  } else if (req.url === "/allusers" && req.method === "GET") {
    // Read the users from the file and display them without passwords
    fs.readFile("text.txt", "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error in reading data");
      } else {
        const users = data
          .split("\n")
          .filter((line) => line.includes("Username:"))
          .map((line) => line.split(",")[0]);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
                    <html>
                    <body>
                        <h1>All Users</h1>
                        <ul>
                            ${users.map((user) => `<li>${user}</li>`).join("")}
                        </ul>
                    </body>
                    </html>
                `);
      }
    });
  } else {
    // Handle unknown routes
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`severing running on Port:${PORT}`);
});
