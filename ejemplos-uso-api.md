# Ejemplos de Uso de la API de Items

## Estructura de Base de Datos Actualizada

La base de datos ahora soporta la estructura JSON que proporcionaste. Los cambios principales incluyen:

### Entidades Actualizadas:

1. **Item**: Entidad principal que puede contener:
   - `id`: ID auto-generado
   - `CONSE`: Consecutivo (opcional)
   - `SUBCO`: Subconsecutivo (opcional)
   - `longTexts`: Relación ManyToOne con LongText (opcional)
   - `inspecciones`: Relación ManyToOne con Inspeccion (opcional)

2. **LongText**: Entidad para textos largos:
   - `id`: ID auto-generado
   - `linea`: Línea (máximo 5 caracteres)
   - `textLine`: Texto de la línea

3. **Inspeccion**: Entidad para inspecciones:
   - `id`: ID auto-generado
   - `codigoGrupo`: Código del grupo
   - `catalogo`: Catálogo
   - `codigo`: Código de inspección
   - `descripcion`: Descripción

## Endpoints Disponibles

### 1. Crear Item Individual
```
POST /items
```

**Ejemplo de Request Body:**
```json
{
  "CONSE": "1",
  "SUBCO": "00001",
  "longTexts": {
    "linea": "line1",
    "textLine": "Esta es la línea 1"
  },
  "inspecciones": {
    "codigoGrupo": "AIREACA",
    "catalogo": "B",
    "codigo": "0010",
    "descripcion": "VENTILADOR"
  }
}
```

### 2. Crear Items en Batch (NUEVO)
```
POST /items/batch
```

**Ejemplo de Request Body (basado en tu JSON):**
```json
{
  "items": [
    {
      "CONSE": "1"
    },
    {
      "SUBCO": "00001",
      "longTexts": {
        "linea": "line1",
        "textLine": "Esta es la línea 1"
      },
      "inspecciones": {
        "codigoGrupo": "AIREACA",
        "catalogo": "B",
        "codigo": "0010",
        "descripcion": "VENTILADOR"
      }
    },
    {
      "SUBCO": "00002",
      "longTexts": {
        "linea": "line1",
        "textLine": "Esta es la línea 1"
      },
      "inspecciones": {
        "codigoGrupo": "AIREACA",
        "catalogo": "B",
        "codigo": "0010",
        "descripcion": "VENTILADOR"
      }
    },
    {
      "CONSE": "2"
    }
  ]
}
```

### 3. Obtener Todos los Items
```
GET /items
```

### 4. Obtener Items por CONSE
```
GET /items/conse/{conse}
```

### 5. Obtener Item por ID
```
GET /items/{id}
```

### 6. Actualizar Item
```
PATCH /items/{id}
```

### 7. Eliminar Item
```
DELETE /items/{id}
```

## Casos de Uso Específicos

### Caso 1: Item Solo con CONSE
Para items que solo necesitan el campo CONSE:
```json
{
  "CONSE": "1"
}
```

### Caso 2: Item Completo con Relaciones
Para items que incluyen longTexts e inspecciones:
```json
{
  "SUBCO": "00001",
  "longTexts": {
    "linea": "line1",
    "textLine": "Esta es la línea 1"
  },
  "inspecciones": {
    "codigoGrupo": "AIREACA",
    "catalogo": "B",
    "codigo": "0010",
    "descripcion": "VENTILADOR"
  }
}
```

## Notas Importantes

1. **Flexibilidad**: Los items pueden crearse con diferentes combinaciones de campos según las necesidades.

2. **Relaciones**: Cuando creas un item con `longTexts` o `inspecciones`, se crean automáticamente las entidades relacionadas.

3. **Batch Processing**: El endpoint `/items/batch` permite crear múltiples items de una vez, ideal para procesar la estructura JSON que proporcionaste.

4. **Validación**: Todos los DTOs incluyen validación automática usando class-validator.

5. **Documentación**: Los endpoints están documentados con Swagger/OpenAPI y disponibles en `/api`.

## Configuración de Base de Datos

Para aplicar los cambios de base de datos, ejecuta el archivo `database-update.sql` en tu base de datos MySQL. 