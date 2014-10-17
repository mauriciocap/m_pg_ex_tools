m_pg_ex_tools
=============

La aplicacion se actualiza dinamicamente evaluando en el contexto pg scripts que lee de la SD, que puede haber bajado de la web o editado el usuario.

Si existe inno/pg/0init.txt , se ejecuta ese solo.
Sino, se muestra la UI para bajar app.js de una url.
Los archivos que se bajan van a inno/pg/dflt/...
Para que funcione tambien cuando esta offline Y sea facil modificarlos en el telefono directamente,
Se buscan en inno/pg/... (si lo modificaste a mano en el telefono)
Si no estan, se buscan en inno/pg/dflt (lo bajamos de la web)

