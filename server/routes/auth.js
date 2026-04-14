const express = require("express");
const passport = require("passport");
const { createClient } = require("@supabase/supabase-js");

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// SIGN UP
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) return res.status(400).json(error);

  // ✅ Insert into your USERS table AFTER signup
  if (data?.user) {
    await supabase.from("public.USERS").insert([
      {
        id: data.user.id,
        email: data.user.email,
      },
    ]);
  }

  res.json(data);
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(400).json(error);

  res.json(data);
});

// GOOGLE LOGIN
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// GOOGLE CALLBACK
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL);
  }
);

// LOGOUT
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(process.env.CLIENT_URL);
  });
});

module.exports = router;