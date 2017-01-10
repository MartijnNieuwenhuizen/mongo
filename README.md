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

1. Make a simple session login with Middleware
2. Add the session login data to MongoDB
3. Create an input form if you're logged in
4. Store items in de MongoDB thrue the form
5. render the MongoDB collection
6. Add all the data to the MongoDB collection
7. Make it possible to edit a file in the collection
9. Style the basic pages
8. Style the collection items per type
9. DONE!

## 3.1 Creating a session login with Middleware
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
