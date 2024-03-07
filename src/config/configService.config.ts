export default () => ({
  secret_key: process.env.API_SECRET_KEY,
  db: {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_SECRET,
    dbname: process.env.DB_NAME,
  },
  admin: {
    id: process.env.ADMIN_ID,
    secret: process.env.ADMIN_SECRET
  },
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  channel_name: process.env.CHANNEL_NAME,
});
