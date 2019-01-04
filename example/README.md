``
npm install
npm run start
``

This is a simple example application for demonstrating the `easy-reactions` module. There are three routes:

``POST localhost:3000/add-reaction``
``POST localhost:3000/remove-reaction``
``POST localhost:3000/toggle-reaction``

All routes require the following body:
```
    {
      "itemId": "5c2f8c652300b803a4b40f8e",
      "ownerId": "5c2f8c652300b803a4b40f91",
      "reactionType": "like"
    }
```

You can use Postman to test it.

The possible reaction types are: `like`, `dislike`, `love`, `angry`.