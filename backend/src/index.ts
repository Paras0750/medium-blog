import { Hono } from "hono";

import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import {
  signupInput,
  signinInput,
  createPostInput,
  updatePostInput,
} from "@paras_nauriyal/common";

interface IPost {
  title: string;
  content: string;
  author: string;
}

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRETS: string;
  };
  Variables: {
    userID: any;
  };
}>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.use("/blog/*", async (c, next) => {
  const token = c.req.header("Authorization")?.split(" ")[1];
  if (!token) return c.text("Unauthorized");

  try {
    const decoded = await verify(token, c.env.JWT_SECRETS);
    c.set("userID", decoded.id);
  } catch (e) {
    console.log(e);
    return c.text("Unauthorized");
  }

  await next();
});

app.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();

  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });
    const token = await sign({ id: user.id }, c.env.JWT_SECRETS);

    return c.text(token);
  } catch (e) {
    console.log(e);
    return c.text(JSON.stringify(e));
  }
});

app.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
        password: body.password,
      },
    });

    if (!user) return c.text("User not found");

    const token = await sign({ id: user.id }, c.env.JWT_SECRETS);

    return c.json({
      token: token,
    });
  } catch (e) {
    console.log(e);
    return c.text(JSON.stringify(e));
  }
});

app.post("/blog", async (c) => {
  const userId = c.get("userID");
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: userId,
    },
  });
  return c.json({
    id: post.id,
  });
});

app.put("/blog", async (c) => {
  const userId = c.get("userID");
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const post = await prisma.post.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });
  return c.text("Updated Blog!");
});

app.get("/blog/:id", async (c) => {
  const blogId = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: blogId,
      },
    });
    return c.json({ post: post });
  } catch (error) {
    console.log(error);
    return c.json({
      err: error,
    });
  }
});

app.get("/blog", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const posts = await prisma.post.findMany();

  return c.json({ posts: posts });
});
export default app;
