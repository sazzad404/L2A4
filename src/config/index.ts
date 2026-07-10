import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  app_url: process.env.APP_URL,
  bycypt_salt_rounds: process.env.BYCYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expiration: process.env.JWT_REFRESH_EXPIRES_IN,
  jwt_access_expiration: process.env.JWT_ACCESS_EXPIRES_IN,

  stripe_secret_key: process.env.STRIPE_SECRET_KEY!,
  stripe_price_id: process.env.STRIPE_PRICE_ID!,
};
