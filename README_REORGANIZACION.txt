SANTIEL TV — REORGANIZACION BASE

Esta version reorganiza el proyecto para prepararlo para:

- sistema premium/free
- sorteos
- referidos
- panel admin
- escalabilidad
- migracion futura a Vercel Functions

IMPORTANTE:
Esta reorganizacion es una BASE inicial.
Antes de reemplazar el proyecto original:
1. revisar imports
2. revisar rutas relativas
3. validar vite.config
4. validar alias
5. validar netlify/vercel functions

Siguiente recomendacion:
- crear carpeta /services
- crear /contexts
- separar hooks
- implementar Zustand o Context API
