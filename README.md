# Nest Boilerplate

## Spec

1. User authentication
2. Task scheduling

## Before Starting

1. Set up .env, ormconfig.json files

```
--- .env ---
SESSION_SECRET = "session_secret"
JWT_SECRET = "jwt_secret"
```

```
---ormconfig.json---
{
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "root",
  "password": "root",
  "database": "test",
  "entities": ["dist/*/entities/*.entity.js"],
  "synchronize": true
}
```

## Installed Modules

1. TypeORM
2. Compression
3. Helmet
4. Csurf
5. Throttler
6. Passport
7. Bcrypt
8. Cookie-parser
9. Express-session
10. Class-validator, Class-transformer
11. Cache-manger
12. Schedule
