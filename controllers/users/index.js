import Users from "../../models/Usermodel/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
  try {
    const users = await Users.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
  }
};

export const Register = async (req, res) => {
  const { name, password, confpass } = req.body;
  if (password !== confpass) {
    return res.status(400).json({ msg: "password tidak sama dengan confirm" });
  }
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await Users.create({
      name,
      password: hashPassword,
    });
    res.json({ msg: "ubah password berhasil" });
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        name: req.body.name,
      },
    });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Wrong Password" });
    const UserId = user[0].id;
    const name = user[0].name;
    const accessToken = jwt.sign({ UserId, name }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "20s",
    });
    const refreshToken = jwt.sign({ UserId, name }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: UserId,
        },
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // Mengubah maxAge menjadi detik
      secure: true, // set to true if your using https or samesite is none
      sameSite: "none",
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "user saalah" });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const useId = user[0].id;
  await Users.update(
    { refresh_token: null },
    {
      where: {
        id: useId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};
