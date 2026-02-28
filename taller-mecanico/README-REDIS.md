# Redis Setup para Taller Mecánico

## 🚀 Iniciar Redis

```bash
docker-compose up -d
```

## 📊 Verificar que Redis está corriendo

```bash
docker ps
```

Deberías ver:
- `taller-mecanico-redis` (Puerto 6379)
- `taller-mecanico-redis-ui` (Puerto 8081)

## 🔍 Acceder a Redis Commander (UI)

Abre tu navegador en: http://localhost:8081

Aquí podrás ver:
- Sessions activas
- Refresh tokens almacenados
- Cualquier dato en Redis

## 🛠️ Comandos Útiles

### Conectarse a Redis CLI
```bash
docker exec -it taller-mecanico-redis redis-cli -a redisPassword123
```

### Ver todas las keys
```bash
KEYS *
```

### Ver sesiones activas
```bash
KEYS sess:*
```

### Ver refresh tokens
```bash
KEYS refresh_token:*
```

### Eliminar una key específica
```bash
DEL sess:abc123
```

### Ver información del servidor
```bash
INFO
```

## 📦 Instalación de Dependencias NestJS

Para usar Redis en tu proyecto NestJS:

```bash
npm install @nestjs/cache-manager cache-manager cache-manager-redis-store
npm install ioredis
npm install @types/ioredis --save-dev
```

## 🔧 Configuración en NestJS

### 1. Session Store (app.module.ts)

```typescript
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      ttl: 3600, // 1 hora
    }),
  ],
})
```

### 2. Refresh Token Store

Crear un servicio dedicado para manejar refresh tokens en Redis.

## 🔒 Seguridad

- Cambia `REDIS_PASSWORD` en tu archivo `.env`
- En producción, usa contraseñas fuertes
- Considera usar Redis con TLS/SSL

## 🛑 Detener Redis

```bash
docker-compose down
```

## 🗑️ Eliminar datos de Redis

```bash
docker-compose down -v
```

## 📝 Estructura de Keys Recomendada

- **Sessions**: `sess:{sessionId}`
- **Refresh Tokens**: `refresh_token:{userId}`
- **Rate Limiting**: `rate_limit:{ip}:{endpoint}`
- **Cache**: `cache:{resource}:{id}`

## 🎯 Casos de Uso

### 1. Session Store Distribuido
- Múltiples instancias de backend comparten sesiones
- Usuario autenticado en servidor A puede acceder desde servidor B

### 2. Refresh Token Store
- Almacenar refresh tokens activos
- Invalidar tokens en logout
- Detectar tokens robados (rotation)

### 3. Rate Limiting
- Limitar peticiones por IP
- Prevenir ataques de fuerza bruta

### 4. Cache
- Cachear consultas frecuentes
- Reducir carga en PostgreSQL/MongoDB
