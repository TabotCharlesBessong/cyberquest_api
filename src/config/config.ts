import "dotenv/config";

interface DatabaseConfig {
  url?: string;
  host?: string;
  port?: number;
  name?: string;
  user?: string;
  password?: string;
  dialect: "postgres";
}

interface JwtConfig {
  secret: string;
  expiresIn: string;
}

interface EmailConfig {
  host?: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
  from: string;
}

const primaryDb = process.env.PRIMARY_DB || "local";

const database: DatabaseConfig =
  primaryDb === "supabase"
    ? {
        url: process.env.SUPABASE_DB_URL,
        dialect: "postgres",
      }
    : {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "", 10) || 5432,
        name: process.env.DB_NAME || "cyberquest",
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        dialect: "postgres",
      };

const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "", 10) || 4000,

  database,

  jwt: {
    secret: process.env.JWT_SECRET || "dev_insecure_secret_change_me",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  } as JwtConfig,

  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "", 10) || 587,
    secure: process.env.EMAIL_SECURE === "true",
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || "CyberQuest <no-reply@cyberquest.app>",
  } as EmailConfig,

  clientUrl: process.env.CLIENT_URL || "http://localhost:8081",

  primaryDb,

  // How long verification / reset codes stay valid (minutes)
  codeExpiryMinutes: 15,
};

export default config;
