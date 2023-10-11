# Web Programming HW#2
### 1. setup backend `.env`
create your own `.env` in backend.
```bash
cd backend
```
Then, fill in the `MONGO_URL` field in `.env` with your MongoDB connection string and fill in the `PORT` field with the port you want to use. After that, you're `.env` file should look like this. If you don't want to use MongoDB Atlas, you can also run a local MongoDB server with Docker. You can find the instructions [here](https://hub.docker.com/_/mongo).

```bash
PORT=8000
MONGO_URL="mongodb+srv://<username>:<password>@<cluster>.example.mongodb.net/?retryWrites=true&w=majority"
```
### 2. setup frontend `.env`
create .env in frontend
```bash
cd frontend
```
paste this line in .env:
```bash
VITE_API_URL="http://localhost:8000/api"
```

### init this project
```bash
cd frontend
yarn
cd ..
cd backend
yarn
```

### 3. start the backend server

```bash
cd backend
yarn dev
```

### 4. start the frontend server

```bash
cd frontend
yarn dev
```

Visit `http://localhost:5173` to see the app in action.

## eslint and prettier
check lint in frontend and backend
```bash
cd frontend
yarn lint
```

```bash
cd backend
yarn lint
```

# Visit http://localhost:5173
1. click "ADD A PLAYLIST"
2. click "DELETE" to delete playlist
3. after creating a playlist, click "EDIT PLAYLIST"
  1. just directly edit name, description of playlist.
      (if no name/description, there will be alert)
      > Also, click the photo and edit photo link to customize your playlist photo (URL like https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTBn0d8jozNhs8Qn_9v_H11Ck-7Dla_DgMvg&usqp=CAU)
  2. click "ADD A CARD"
      1. enter title, singer, and link(link can be a URL like https://www.google.com/)
      (if no title/singer/link, there will be corresponding alert)
      2. click "EDIT CARD" in Action column to edit the card.
      3. click the duplicate icon in Action column to duplicate specific song to another playlist.
      4. select checkbox and "DELETE SELECTED CARDS" to delete selected cards.
      5. a select-all checkbox

  