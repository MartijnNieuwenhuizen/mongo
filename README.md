# MongoDB Test
This repository is for learning MongoDb and studying MongoDB.

I will be documenting all my steps to show you my learing curve.

# 1. Setting up NodeJS with Express
I just followed the basic [Express installation guide](http://expressjs.com/en/starter/installing.html).

Setup the package.json
```
$ npm init
```

Install express (I don't know if this is necessary, but it works)
```
$ npm install express --save
```

Install the express generator
```
$ npm install express-generator -g
```

Setup Express with the EJS templating engine
```
$ express --view=ej
```

Install the necessary NPM dependancies
```
$ npm install
```

Install Nodemon for automatic restart on a server error
```
$ npm install --save nodemon
```

Run the app
```
$ nodemon app
```

# 2. Installing MongoDB
I've tried a lot of ways to install MondgoDB and this is the one that works form me. In other attempts I got an error that the /data/db wasn't there or didn't have the right rights. Sinds i'm not very common with file permission and things like that, I tried it in oter way's for me the magical terminal command was: ``` mongod --dbpath=/data --port 27017 ```.

I used [Monk](https://automattic.github.io/monk/docs/GETTING_STARTED.html) to setup the connection with MongoDB.
So here are the steps I took.

Open a new window in your terminal and Update Homebrew to install MongoDB (if you don't have Homebrew, install it with [this guide](http://brew.sh/))
```
brew update
```

Install MongoDB with Brew (stil in the same terminal screen and in the same root folder)
```
$ brew install mongodb
```

Go to your project dir in your terminal screen and install Monk
```
$ npm install monk --save
```

Create a DB with the right permissions
```
mongod --dbpath=/data --port 27016
```

Setup Monk in */routes/index.js*
```
const monk = require('monk');

const url = 'localhost:27016';
const db = monk(url);
const collection = db.get('document');
const fakeData = [
{
    title: 'Part one',
    pages: '121'
  },
  {
    title: 'Part two',
    pages: '101'
  },
  {
    title: 'Part three',
    pages: '120'
  },
];

collection.insert(fakeData)
  .then(data => {
    console.log(data);
    res.render('index', { title: 'MongoDB Test', data: data });
  })
  .catch(err => {
    console.log(err);
  })
  .then(() => db.close());

db.then(() => {
  console.log('Connected correctly to server');
});
```

Make a loop in the index.ejs
```
<ul>
  <% for (var i = 0; i < data.length; i++) { %>
      <li>
        <p>Book: <strong><%= data[i].title %></strong>, has <strong><%= data[i].pages %></strong> pages</p>
      </li>
  <% } %>
</ul>
```

Now it should work!
For further documentation on Monk: [Monk Documentation](https://automattic.github.io/monk/)
