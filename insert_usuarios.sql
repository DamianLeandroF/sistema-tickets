-- Script para insertar usuarios en la base de datos sistema_tickets
-- Ejecutar este script en MySQL

USE sistema_tickets;

-- Limpiar datos existentes (opcional - comentar si quieres mantener datos)
-- DELETE FROM tickets;
-- DELETE FROM usuarios;

-- Insertar usuarios de prueba
INSERT INTO usuarios (id, password, nombre, tipo, forzar_cambio, bloqueado, email, fallas, marcas_retorno) VALUES
(1, '1', 'Administrador Principal', 'admin', FALSE, FALSE, 'admin@iset.com', 0, 0),
(2, '2', 'Juan Técnico', 'tecnico', FALSE, FALSE, 'juan@iset.com', 0, 0),
(3, '3', 'Pedro Trabajador', 'trabajador', FALSE, FALSE, 'pedro@iset.com', 0, 0),
(4, '4', 'María Técnico', 'tecnico', FALSE, FALSE, 'maria@iset.com', 0, 0),
(5, '5', 'Carlos Trabajador', 'trabajador', FALSE, FALSE, 'carlos@iset.com', 0, 0),
(6, '6', 'Ana Trabajador', 'trabajador', FALSE, FALSE, 'ana@iset.com', 0, 0),
(7, '7', 'Luis Técnico', 'tecnico', FALSE, FALSE, 'luis@iset.com', 0, 0),
(8, '8', 'Sofia Admin', 'admin', FALSE, FALSE, 'sofia@iset.com', 0, 0);

-- Verificar que se insertaron correctamente
SELECT * FROM usuarios;

-- Mostrar resumen por tipo
SELECT tipo, COUNT(*) as cantidad FROM usuarios GROUP BY tipo;
