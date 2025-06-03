-- Actualización de la base de datos para la estructura de Items
USE db_seppat;

-- Tabla: long_text (ahora con item_id para la relación OneToMany)
CREATE TABLE IF NOT EXISTS long_text (
    id INT AUTO_INCREMENT PRIMARY KEY,
    linea VARCHAR(5) NOT NULL,
    textLine TEXT NOT NULL,
    item_id INT NULL,
    FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE CASCADE
);

-- Tabla: inspeccion
CREATE TABLE IF NOT EXISTS inspeccion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigoGrupo VARCHAR(50) NOT NULL,
    catalogo VARCHAR(50) NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    descripcion VARCHAR(500) NOT NULL
);

-- Tabla: item (sin long_text_id ya que ahora la relación está en long_text)
CREATE TABLE IF NOT EXISTS item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    CONSE VARCHAR(10) NULL COMMENT 'Consecutivo - ID que manda del aviso de mantenimiento',
    SUBCO VARCHAR(5) NULL COMMENT 'Subconsecutivo - Se incrementa según inspecciones y long_text'
);

-- Tabla de relación: item_inspeccion (Many-to-Many entre Item e Inspeccion)
CREATE TABLE IF NOT EXISTS item_inspeccion (
    item_id INT NOT NULL,
    inspeccion_id INT NOT NULL,
    PRIMARY KEY (item_id, inspeccion_id),
    FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE CASCADE,
    FOREIGN KEY (inspeccion_id) REFERENCES inspeccion(id) ON DELETE CASCADE
);

-- Tabla de relación: item_aviso_mantenimiento (Many-to-Many)
CREATE TABLE IF NOT EXISTS item_aviso_mantenimiento (
    item_id INT NOT NULL,
    aviso_mantenimiento_id INT NOT NULL,
    PRIMARY KEY (item_id, aviso_mantenimiento_id),
    FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE CASCADE,
    FOREIGN KEY (aviso_mantenimiento_id) REFERENCES avisos_mantenimiento(id) ON DELETE CASCADE
);

-- Migración: eliminar columnas que ya no se usan
-- ALTER TABLE item DROP COLUMN IF EXISTS long_text_id;
-- ALTER TABLE item DROP COLUMN IF EXISTS inspeccion_id;

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_item_conse ON item(CONSE);
CREATE INDEX IF NOT EXISTS idx_item_subco ON item(SUBCO);
CREATE INDEX IF NOT EXISTS idx_long_text_linea ON long_text(linea);
CREATE INDEX IF NOT EXISTS idx_long_text_item_id ON long_text(item_id);
CREATE INDEX IF NOT EXISTS idx_inspeccion_codigo_grupo ON inspeccion(codigoGrupo);
CREATE INDEX IF NOT EXISTS idx_inspeccion_codigo ON inspeccion(codigo);

-- Datos de ejemplo basados en el JSON proporcionado
INSERT INTO long_text (linea, textLine) VALUES
('line1', 'Esta es la línea 1')
ON DUPLICATE KEY UPDATE textLine = VALUES(textLine);

-- Insertar datos de inspecciones de ejemplo
INSERT INTO inspeccion (id, codigoGrupo, catalogo, codigo, descripcion) VALUES
(1, 'AIREACA', 'B', '0010', 'VENTILADOR'),
(2, 'AIREACA', 'B', '0020', 'FILTRO DE AIRE'),
(3, 'AIREACA', 'B', '0030', 'COMPRESOR')
ON DUPLICATE KEY UPDATE 
  codigoGrupo = VALUES(codigoGrupo),
  catalogo = VALUES(catalogo),
  codigo = VALUES(codigo),
  descripcion = VALUES(descripcion); 