CREATE DATABASE IF NOT EXISTS db_seppat;
USE db_seppat;

-- Tabla: tipo_aviso
CREATE TABLE tipo_aviso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

-- Tabla: equipo
CREATE TABLE equipo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

-- Tabla: ubicacion_tecnica
CREATE TABLE ubicacion_tecnica (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

-- Tabla: master_user
CREATE TABLE master_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Tabla: puesto_trabajo
CREATE TABLE puesto_trabajo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

-- Tabla: sensor
CREATE TABLE sensor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(255) NOT NULL
);

-- Tabla: parte_objeto
CREATE TABLE parte_objeto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    sensor INT,
    FOREIGN KEY (sensor) REFERENCES sensor(id)
);

-- Tabla: reporter_user
CREATE TABLE reporter_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cedula VARCHAR(255) NOT NULL,
    puesto_trabajo INT,
    FOREIGN KEY (puesto_trabajo) REFERENCES puesto_trabajo(id)
);

-- Tabla: avisos_mantenimiento
CREATE TABLE avisos_mantenimiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_ext VARCHAR(255),
    tipo_aviso INT,
    equipo INT,
    ubicacion_tecnica INT,
    texto_breve TEXT,
    fecha_inicio DATE,
    fecha_fin DATE,
    hora_inicio TIME,
    hora_fin TIME,
    estado ENUM('pendiente', 'en_proceso', 'finalizado') NOT NULL,
    puesto_trabajo INT,
    reporter_user INT,
    parte_objeto INT,
    master_user INT,
    FOREIGN KEY (tipo_aviso) REFERENCES tipo_aviso(id),
    FOREIGN KEY (equipo) REFERENCES equipo(id),
    FOREIGN KEY (ubicacion_tecnica) REFERENCES ubicacion_tecnica(id),
    FOREIGN KEY (puesto_trabajo) REFERENCES puesto_trabajo(id),
    FOREIGN KEY (reporter_user) REFERENCES reporter_user(id),
    FOREIGN KEY (parte_objeto) REFERENCES parte_objeto(id),
    FOREIGN KEY (master_user) REFERENCES master_user(id)
);