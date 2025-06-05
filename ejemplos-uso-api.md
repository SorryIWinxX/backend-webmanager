# Ejemplos de Uso de la API de Avisos de Mantenimiento

## Estructura Actualizada para Avisos de Mantenimiento

La API ahora soporta la creación de avisos de mantenimiento con la nueva estructura donde por cada N inspecciones debe haber N longText correspondientes.

### Estructura JSON Actualizada:

```json
{
  "numeroExt": "EXT-2024-001",
  "masterUser": 1,
  "tipoAviso": 1,
  "equipo": 1,
  "reporterUser": 1,
  "material": 1,
  "textoBreve": "Bomba centrífuga presenta ruido anormal y vibración excesiva",
  "fechaInicio": "2024-01-15",
  "fechaFin": "2024-01-16",
  "horaInicio": "08:00:00",
  "horaFin": "17:00:00",
  "items": [
    {
      "inspeccionIds": [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ],
      "longTextIds": [
        {
          "linea": "line1",
          "textLine": "Esta es la línea 1"
        },
        {
          "linea": "line2",
          "textLine": "Esta es la línea 2"
        },
        {
          "linea": "line3",
          "textLine": "Esta es la línea 3"
        }
      ]
    }
  ]
}
```

## Endpoints Disponibles

### 1. Crear Aviso de Mantenimiento
```
POST /avisos-mantenimiento
```

**Importante**: El número de arrays en `inspeccionIds` debe coincidir exactamente con el número de objetos en `longTextIds`. En el ejemplo anterior:
- 3 arrays de inspecciones: `[1,2,3]`, `[4,5,6]`, `[7,8,9]`
- 3 objetos longText correspondientes

Esto creará 3 items separados:
1. Item 1: inspecciones 1,2,3 con longText "Esta es la línea 1"
2. Item 2: inspecciones 4,5,6 con longText "Esta es la línea 2"  
3. Item 3: inspecciones 7,8,9 con longText "Esta es la línea 3"

### 2. Casos de Uso Específicos

#### Caso 1: Un solo set de inspecciones
```json
{
  // ... otros campos del aviso ...
  "items": [
    {
      "inspeccionIds": [
        [1, 2, 3]
      ],
      "longTextIds": [
        {
          "linea": "line1",
          "textLine": "Revisión de ventilador"
        }
      ]
    }
  ]
}
```

#### Caso 2: Múltiples sets de inspecciones
```json
{
  // ... otros campos del aviso ...
  "items": [
    {
      "inspeccionIds": [
        [1, 2, 3],
        [4, 5],
        [6, 7, 8, 9]
      ],
      "longTextIds": [
        {
          "linea": "line1",
          "textLine": "Revisión del sistema de aire acondicionado"
        },
        {
          "linea": "line2", 
          "textLine": "Verificación de filtros"
        },
        {
          "linea": "line3",
          "textLine": "Mantenimiento del compresor"
        }
      ]
    }
  ]
}
```

### 3. Validaciones Importantes

1. **Correspondencia 1:1**: Cada array de inspecciones debe tener un longText correspondiente
2. **Error de validación**: Si el número no coincide, se retornará un error:
   ```
   "El número de sets de inspecciones (X) debe coincidir con el número de longTexts (Y)"
   ```

### 4. Otros Endpoints

```
GET /avisos-mantenimiento        # Obtener todos los avisos
GET /avisos-mantenimiento/{id}   # Obtener aviso por ID
PATCH /avisos-mantenimiento/{id} # Actualizar aviso
```

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