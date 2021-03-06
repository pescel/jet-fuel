const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const md5 = require('md5');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('port', process.env.PORT || 3000);

app.locals.title = 'jet fuel.';
app.locals.id = 0;
app.locals.folders = [];
app.locals.urls = [];

app.get('/', (req, res) => {
  fs.readFile(`${__dirname}/index.html`, (err, file) => {
    res.send(file)
  });
});

app.get('/:id', (request, response) => {
  const id = request.params.id
  database('urls').where('id', request.params.id).increment('clicks', 1)
  .then(function(){
    database('urls').where('id', id).select()
        .then(function(url) {
          console.log(url);
          response.redirect(`http://${url[0].url}`);
        })
        .catch(function(error) {
          console.error(error)
        });
    })
})

app.get('/api/folders', (req, res) => {
  database('folders').select()
          .then(urls => {
            res.status(200).json(urls);
          })
          .catch(error => {
            console.log(error);
            console.error('somethings wrong with db')
          });
})


app.post('/api/folders/', (req, res) => {
  const { name } = req.body
  const folder = { name }

  database('folders').insert(folder)
  .then(response => {
    database('folders').select()
      .then(folders => {
        res.status(200).json(folders);
      })
      .catch(error => {
        console.log(error);
        console.error('somethings wrong with db');
      })
  })
})

app.get('/api/folders/:folderId', (req, res) => {
  database('urls').where('folder_id', req.params.folderId).select()
    .then(urls => {
      res.status(200).json(urls);
    })
    .catch(error => {
      console.log(error);
      console.error('somethings wrong with db');
    })
})

app.post('/api/folders/', (req, res) => {
  const { name } = req.body
  const folder = { name }

  database('folders').insert(folder)
  .then(response => {
    database('folders').select()
      .then(folders => {
        res.status(200).json(folders);
      })
      .catch(error => {
        console.log(error);
        console.error('somethings wrong with db');
      })
  })
})

app.post('/api/folders/:folderId', (req, res) => {
  const folder_id = req.params.folderId;
  let date = new Date;
  const url = req.body.url;
  const clicks = 0;
  const new_url = {folder_id, date, url, clicks};

  database('urls').insert(new_url)
  .then(response => {
    database('urls').where('folder_id', req.params.folderId).select()
    .then(urls => {
      console.log('success')
      res.status(200).json(urls)
    })
    .catch(error => {
      console.log(error);
      console.error('somethings wrong with db');
    })
  })
})

app.patch('/api/folders/:urlId', (req, res) => {
  database('urls').increment('clicks', 1).where('id', req.params.urlId)
  .then(response => {
    database('urls').where('folder_id', req.body.folderId).select()
    .then(urls => {
      res.status(200).json(urls);
    })
    .catch(error => {
      console.log(error);
      console.error('somethings wrong with db');
    })
  })
})

s
