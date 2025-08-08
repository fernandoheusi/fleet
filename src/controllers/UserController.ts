import type { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export class UserController {
  async create(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const userExists = await User.findOne({ email: email });

      if (userExists) {
        res.status(422).json({ msg: "email ja cadastrado" });
        return;
      }

      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = {
        id: uuidv4(),
        name: name,
        email: email,
        password: passwordHash,
      };

      await User.create(user);

      console.log(`User ${name} created`);

      res.status(201).json({ user, msg: `user ${user.name} created.` });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: "error" });
    }
  }
  async auth(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(422).json({ msg: "Dados incompletos" });
        return;
      }

      const user = await User.findOne({ email: email });

      if (!user) {
        res.status(401).json({ msg: "Email ou senha incorretos" });
        return;
      }

      const checkPassword = await bcrypt.compare(password, user.password);

      if (!checkPassword) {
        res.status(401).json({ msg: "Email ou senha incorretos" });
        return;
      }

      try {
        const secret = process.env.SECRET || "default-secret-key";

        const jwtToken = jwt.sign(
          {
            id: user.id,
          },
          secret
        );
        res.status(200).json({
          jwtToken,
          name: user.name,
          id: user.id,
          msg: `Login realizado com sucesso`,
        });
      } catch (error) {
        res.status(500).json({ msg: `nao foi possivel logar` });
      }

      console.log(`User ${user.name} logged in`);
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: "error" });
    }
  }
}
