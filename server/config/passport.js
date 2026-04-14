const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const supabase = require("../db/supabase");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        const displayName = profile.displayName;
        const avatar = profile.photos?.[0]?.value;

        // 1. Get or create user
        let { data: user, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single();

        if (!user) {
          const { data: newUser, error: insertError } = await supabase
            .from("users")
            .insert({
              email,
              display_name: displayName,
              profile_image_url: avatar,
            })
            .select()
            .single();

          if (insertError) throw insertError;

          user = newUser;
        }

        // 2. Link Google provider
        const { error: providerError } = await supabase
          .from("user_auth_providers")
          .upsert(
            {
              user_id: user.id,
              provider: "google",
              provider_user_id: googleId,
              access_token: accessToken,
              refresh_token: refreshToken,
            },
            {
              onConflict: "provider,provider_user_id",
            }
          );

        if (providerError) throw providerError;

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// session handling
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    done(null, user);
  } catch (err) {
    done(err, null);
  }
});