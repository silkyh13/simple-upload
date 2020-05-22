require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const port = 3001;
const AWS = require('aws-sdk');
const fs = require('fs'); // Needed for example below
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });


const spacesEndpoint = new AWS.Endpoint('sfo2.digitaloceanspaces.com');
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET
});

app.get("/api/test", (req, res) => {
  res.send("Works");
})

app.post("/api/image", upload.single("image"), (req, res) => {
  const params = {
    Bucket: process.env.SPACES_S3_BUCKET,
    ContentEncoding: "base64",
    ContentType: "image/*",
    Key: `images/${req.file.originalname}`,
    Body: req.file.buffer,
  };

  s3.putObject(params, (err, data) => {
    if (err) {
      console.log(err, err.stack)
    }else {
      res.send(
        s3.getSignedUrl("getObject", {
          Bucket: process.env.SPACES_S3_BUCKET,
          Key: `images/${req.file.originalname}`,
          Expires: 60*60*10
        })
      );
      console.log('yay it uploaded')
    }
  });
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
