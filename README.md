# Ecommerce desde el lado del Backend
### Proyecto final hecho para el curso de Programación Backend en la plataforma Coderhouse.

Link al aplicativo con deploy en Railway : 
[View Deployment](https://pfinal-backend-luccaroni-production.up.railway.app/)

> Ecommerce donde se aplican conocimientos de Backend. Base de datos en MongoDB Atlas y render hacia el frontEnd mediante Handlebars.

## Características

La aplicación es un ecommerce desarrollado desde el lado del backend con base de daatos en Mongo Atlas.
Se puede realizar un proceso de compra completo (sin opción de pago real, aunque se puede implementar utilizando Stripe). Tiene registro de usuarios completo con hasheo de contraseña, inicio de sesión, recuperación de contraseña con link por mail, tipos de usuarios (estandar y premium), mock de productos, seleccion de productos, carrito de compras, orden de compra y todo esta renderizado mediante handlebars.

### Usuarios
Hay dos tipos de usuarios:
> User: Pueden seleccionar productos, armar su carrito de compras y confirmar un pedido. Les llegará un correo con la confirmación de la compra + nro de orden.

> Premium: Pueden agregar productos al stock de la aplicación y editar los mismos.  Para esto primero deben subir tres documentos y luego si son correctos se realiza el cambio de tipo. No pueden editar o eliminar productos que no hayan creado.

## Rutas
Para ver las rutas disponibles, como funciona cada y los schemas desarrollados [haz click aquí.](https://pfinal-backend-luccaroni-production.up.railway.app/apidocs)

## Tech
Librerias utilizadas:
* @faker-js/faker
* bcrypt
* connect-mongo
* cookie-parser
* dotenv
* express
* express-handlebars
* express-session
* jsonwebtoken
* mongoose
* mongoose-paginate-v2
* multer
* nodemailer
* passport
* passport-github2
* passport-local
* session-file-store (en primera instancia)
* swagger-jsdoc
* swagger-ui-express
* winston

Librerias de testing:
* chai
* mocha
* supertest
