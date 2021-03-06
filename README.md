# MongoDB Test
This repository is for learning MongoDb and studying MongoDB.

I will be documenting all my steps to show you my learing curve.

## 1. Setting up NodeJS with Express
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
$ express --view=ejs
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

## 2. Installing MongoDB
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

## 3. Starting my project
For my internship at [Occhio](https://occhio.nl) I keep track of everything I do in a day with a thing I call **Thing of the day**. This is just an ordenary textfile with al list of items i discovered every day.

My idea is to print this list with a custum layout for every type of thing. For instance, there will be quotes, code, thoughts etc. All this data need to be stored in a DB where I will be useing MongoDB.
Also, I must be able to add/edit the data, which means there needs to be a login with a users DB and a form to add/edit data.

This will be the steps I think I need to take.

1. ~~Make a simple session login with Middleware~~
2. ~~Add the session login data to MongoDB~~
3. ~~Create an input form if you're logged in~~
4. ~~Store items in de MongoDB thrue the form~~
5. ~~render the MongoDB collection~~
6. ~~Add all the data to the MongoDB collection~~
7. ~~Make it possible to edit a file in the collection~~
9. Style the basic pages
8. Style the collection items per type
9. DONE!

### 3.1 Creating a session login with Middleware
Install express-session
```
$ npm install express-session --save
```

Create false userData in the app.js
```
app.use((req, res, next) => {
  // Temp users data
  const users = [{
    email: 'martijnnieuwenhuizen@icloud.com',
    pass: 'Wortels16',
    name: {
      first: 'Martijn',
      last: 'Nieuwenhuizen'
    },
    userId: 1,
    collectionId: '65r*8s4qj9x1'
  },{
    email: 'test@test.com',
    pass: 'test',
    name: {
      first: 'test',
      last: 'test'
    },
    userId: 2,
    collectionId: 's59f0s=7'
  }];

  res.locals.users = users;
  next();
});
```

Create a session in the app.js
```
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'E=MC2'
}));
```

Check the auth in the app.js
```
app.use((req, res, next) => {
  // If there's a session and a logedin user
  if (req.session && req.session.userId) {
    const user = res.locals.users.filter( usersD => usersD.userId === req.session.userId);
    res.locals.user = user[0];
    next();
  } else {
    next();
  }
});
```

Create an helper function in */routes/helpers/auth.js*
```
module.exports = {
  login: function(req, res, next) {
    if (req.session && !req.session.userId) {
      // If there's no SessionID (so no logged in user), rederect
      res.redirect('/users/login');
    } else {
      // Nothing on the hand, just continue
      next();
    }
  }
};
```

create a login form an handle the post in the routes/login
```
router.post('/', (req, res, next) => {
  // Data got from post
  const userEmail = req.body.email.toLowerCase();
  const userPass = req.body.password;

  // match the user
  const users = res.locals.users;
  const user = users.filter( machedUser => machedUser.email === userEmail);

  // check if there's a match
  if (user.length > 0) {
    // If the password matches this user
    if (user[0].pass === userPass) {
      // set a session
      const session = req.session;
      session.view = 1;
      session.userId = user[0].userId;

      res.redirect('/');
    } else {
      // User email and password don't match
      const content = {
        title: 'MongoDB Test',
        err: 'email and password doesnt match'
      };

      res.render('login', content);
    }
  } else {
    // User email doesn't exists yet
    res.redirect('/users/sign-up');
  }
});
```

### 3.2 Add the session login data to MongoDB
First i've created a User DB like this (this is replaced code)
```
// Assign temp user data to the res
app.use((req, res, next) => {
  const db = monk('localhost:27017');
  const usersDB = db.get('users');
```

Now there's acces to the usersDB so there needs to be data in it. Because I don't know how to do that with the terminal, I did it with code like this:
```
const fakeData = [{
  email: 'test@test.com',
  pass: 'test',
  name: {
    first: 'test',
    last: 'test'
  },
  userId: 1,
  collectionId: 's59f0s=7'
},{
  email: 'test1@test.com',
  pass: 'test1',
  name: {
    first: 'test1',
    last: 'test1'
  },
  userId: 2,
  collectionId: 'sq76jfg/sio'
}];
//
usersDB.insert(fakeData)
  .then(data => {
    console.log(data);
    res.locals.users = data;
    next();
  })
  .catch(err => {
    console.log(err);
  })
  .then(() => db.close());
```

Not very nice, but it did the trick. After that, just get the data everytime you do a req so the whole pease of middleware will be:
```
// Assign temp user data to the res
app.use((req, res, next) => {
  const db = monk('localhost:27017');
  const usersDB = db.get('users');

  usersDB.find({})
    .then(data => {
      console.log('CHECK: Found the DB');
      res.locals.users = data;
    })
    .catch(err => {
      console.log(err);
    })
    .then(() => {
      db.close();
      next();
    });
});
```

Now the users are pulled from your usersDB

### 3.3 Create an input form if you're logged in
In *routes/helpers/auth.js* I've added this line
```
// Set logedin to true
res.locals.loggedin = true;
```

So if the auth passes, the res.locals.loggedin is set to true. In the *views/base/footer.ejs* I've checked for locals.loggedin (because in the template, there is no response).
If *locals.loggedin* is true, show the form:
```
<% if (locals.loggedin) { %>
```

Now I can handle the post in the *routes/index.js*

### 3.4 Store items in de MongoDB thrue the form
Oke, so my approach is to handle the POST in the *routes/index.js*.
First I want to check the incoming data, then store something to MongoDB if a POST is made and at last store the POST ingot to MongoDB if the POST is made.

Check incoming data on the POST
```
// handle the POST from the add form
router.post('/', (req, res, next) => {
  console.log(req.body);
});
```

Oke, this works, so I want to store the data like this:
```
// handle the POST from the add form
router.post('/', (req, res, next) => {
  const thing = req.body.thing;
  const type = req.body.type;
});
```
or as an object and then add things to it. I'm not shure yet, I will come back to that.

Now I want to PUT something in the DB if a POST is done.
In my *routes/index.js* I've added this code, to insert something into the new collection and render it. In the index.ejs just loop over the new collection like you did with the prev collection
```
// handle the POST from the add form
router.post('/', auth.login, (req, res, next) => {
  const newThing = req.body;
  console.log('CHECK: got a POST');

  // make MongoDB connection
  const db = monk('localhost:27017');
  const collection = db.get('document');
  const test = db.get('testCollection');

  // insert POST into MongoDB
  test.insert(newThing)
    // If insert was succesfull
    .then((check) => {
      console.log('CHECK: Posted');

      // get the normal collection
      collection.find({})
        .then(data => {

          // get the test collection
          test.find({})
          .then(testData => {
            console.log('CHECK: render after post with test data');
            res.render('index', { title: 'MongoDB Test', data: data, test: testData });
          })
          .catch(err => { console.log(err); });
        })
        .catch(err => { console.log(err); });
    })
    .catch(err => {
      console.log('CHECK: POST didnt work');
      console.log(err);
    });
});
```

### 3.5 render the MongoDB collection
This is already done. Now lets remove all the dummy stuff and POST/render the real things

### 3.6 Add all the data to the MongoDB collection
I'm going to rewrite the *index.js* to render and POST the right data

Oke, so the code is clean again and it works! Check the changed code in [this commit](https://github.com/MartijnNieuwenhuizen/mongo/pull/6/commits/64d59f6f98402365ca892462af6b9ad5b45e5081). The POST is now:
```
router.post('/', auth.login, (req, res, next) => {
  console.log('CHECK: got a POST');

  const newThing = req.body;

  // make MongoDB connection
  const db = monk('localhost:27017');
  const things = db.get('things');

  // insert POST into MongoDB
  things.insert(newThing)
    // If insert was succesfull

    .then((newThingsData) => {
      console.log('CHECK: Posted');

      things.find({})
        .then(data => { res.render('index', { thingsData: data }); })
        .catch(err => { console.log(err); })
        .then(() => db.close());
    })
    .catch(err => { console.log('CHECK: POST didnt work: ', err); });
});
```

### 3.7 Make it possible to edit a file in the collection
It needs to be possible to edit your input.

I've desided to use an basic solution without a fancy client side solution.
On the *views/index.ejs* I made an if statement to add a link to every list item if the user is loggedin.

```
    <% if ( loggedin === true ) { %>
```

The link contains a **href** like ``` href="/thing?id=<%= thingsData[i]._id %>" ``` so it contains the unique id of an element in the query. I can get this query with Node by getting ``` const thingId = req.query.id; ```



In the */routes/thing.js*, where I will handle the Req en POSTS to */routes*, I used basicely the same code as I used in */routes/index.js* to get the data from MongoDB, but now replaced

```
things.find({})
```

with

```
things.findOne({_id: thingId})
```

Now I have the data from the item I want to edit.

#### Using one form for two POSTS
For the POST to replace the item, I need to use the same exact form as I used to add one, but now I want all the data already filled in. So thing means the HTML is exactly the same, therefor, I desided to use exactly the same form.

All I have to do is add the data if there's data send from the server.
This is the code to use one form for two different actions, who require exactly the same HTML

```
<%
  var post = "/";
  if (locals.loggedin && loggedin === true) {
    if ( locals.data ) { post = "/thing?id=" + data._id }
%>
  <section class="add">
      <form class="add--form" action=<%= post %> method="post">
        <label class="add--label" for="thing">Your Thing of the day</label>
        <textarea class="add--input" id="thing" type="text" name="thing" rows="8" cols="80"><% if (locals.data) { %><%= data.thing %><% } %></textarea>
        <label class="add--label" for="type">Type</label>
        <div class="add--select-container">
          <select class="add--select" id="type" class="" name="type">
            <option <% if ( locals.data && data.type === "code" ) { %> selected <% } %> value="code">Code</option>
            <option <% if ( locals.data && data.type === "quote" ) { %> selected <% } %> value="quote">Quote</option>
            <option <% if ( locals.data && data.type === "idea" ) { %> selected <% } %> value="idea">Idea</option>
            <option <% if ( locals.data && data.type === "taught" ) { %> selected <% } %> value="taught">Taught</option>
          </select>
        </div>

        <button class="add--submit" type="submit"><% if ( locals.data ) { %>Replace<% } else { %>Add<% } %></button>
      </form>
  </section>
<% } %>
```

To handle the POST and replace it, you will just need this bit of code:

```
router.post('/', auth.login, (req, res, next) => {
  console.log('CHECK: got a POST in "/thing"');

  const newThing = req.body;
  const thingId = req.query.id;

  // make MongoDB connection
  const db = monk('localhost:27017');
  const things = db.get('things');

  // Edit POST in MongoDB
  things.findOneAndUpdate({_id: thingId}, newThing)
    .then((updatedThing) => {
      res.redirect('/');
    })
    .catch(err => { console.log(err); });
});
```

**Important is, that the req.query on a post is the action from the form. So the id in the query needs to be in the action url!**

In the POST handler, you will find a object with the known id and update the values you want to change.
