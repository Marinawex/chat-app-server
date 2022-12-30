import express, { Request, Response } from "express";
import cors from "cors";
import { mockUserDetails } from "../assets/mockUserDetails.js";
import { mockMessages, Message } from "../assets/mockMessages.js";
import bodyParser from "body-parser";

const app = express();
app.use(cors());

const addNameToMessage = () => {
  const mockMessagesWithNames = mockMessages.map((message: Message) => {
    const author = mockUserDetails.find((user) => user.id === message.authorId);
    const authorName = author && author.name;
    return { ...message, authorName };
  });
  return mockMessagesWithNames;
};

const usersIdAndNames = mockUserDetails.map((user) => {
  const name = user.name;
  const id = user.id;
  return { name, id };
});

const saveMessage = (req: Request, res: Response) => {
  const message = req.body;
  const messageWithName = mockUserDetails.filter((user) => {
    return user.id === message.authorId;
  });
  message.likes = [];
  message.authorName = messageWithName[0].name;

  mockMessages.push(message);
  res.status(201).send("ok");
};

const toggleLike = (req: Request, res: Response) => {
  const newMessage: { messageId: number; userId: number; like: boolean } =
    req.body;
  mockMessages.forEach((message) => {
    if (message.id === newMessage.messageId) {
      const userLiked = message.likes.indexOf(newMessage.userId);
      newMessage.like === false
        ? message.likes.push(newMessage.userId)
        : message.likes.splice(userLiked, 1);
    }
  });
  res.status(200).send("changed");
};

app.get("/message", (req: Request, res: Response) => {
  const message = addNameToMessage();
  res.status(200).send(message);
});

app.get("/mockUsers", (req: Request, res: Response) => {
  const users = usersIdAndNames;
  res.status(200).send(users);
});

app.get("/users", (req: Request, res: Response) => {
  const { id } = req.query;
  const userId = mockUserDetails.map((user) => {
    if (user.id.toString() === id) {
      res.status(200).send(user);
    }
  });
});

app.post("/", bodyParser.json(), saveMessage);
app.post("/likes", bodyParser.json(), toggleLike);

app.listen(3006, () => {
  console.log("lisening on port 3006");
});
