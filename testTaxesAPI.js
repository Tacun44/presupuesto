// Script de prueba para la API de impuestos
const db = require('./utils/db');

async function testTaxAPI() {
    console.log('=== INICIANDO PRUEBA DE API DE IMPUESTOS ===');
    
    try {
        // Paso 1: Inicializar la conexión a la base de datos
        console.log('\n1. Iniciando conexión a la base de datos...');
        await db.initializeDb();
        console.log('✅ Conexión establecida correctamente');
        
        // Paso 2: Verificar la estructura de la tabla Taxes
        console.log('\n2. Verificando estructura de la tabla Taxes...');
        const tableStructure = await db.executeQuery(`
            SELECT column_name, data_type, character_maximum_length
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'Taxes'
            ORDER BY ORDINAL_POSITION
        `);
        console.log('✅ Estructura de tabla:');
        console.table(tableStructure);
        
        // Paso 3: Obtener datos de impuestos actuales
        console.log('\n3. Obteniendo impuestos existentes...');
        const taxes = await db.executeQuery('SELECT * FROM dbo.Taxes');
        console.log(`✅ Se encontraron ${taxes.length} impuestos`);
        console.table(taxes);
        
        // Paso 4: Crear un impuesto de prueba
        console.log('\n4. Creando impuesto de prueba...');
        // Generamos un ID aleatorio entre 10000 y 99999
        const taxId = Math.floor(Math.random() * 90000) + 10000;
        
        const taxData = {
            id: taxId,
            name: 'Impuesto de Prueba',
            type: 'iva',
            percentage: 5,
            accountCode: '2408.test',
            description: 'Impuesto creado para pruebas ' + new Date().toISOString()
        };
        
        try {
            const result = await db.executeQuery(`
                INSERT INTO dbo.Taxes (id, name, type, percentage, accountCode, description)
                VALUES (@id, @name, @type, @percentage, @accountCode, @description);
                SELECT @id AS id;
            `, taxData);
            
            console.log('✅ Impuesto creado correctamente:', result);
        } catch (insertError) {
            console.error('❌ Error al crear impuesto:', insertError);
            // Si la tabla no existe, intentar crearla
            if (insertError.message.includes('Invalid object name')) {
                console.log('\nLa tabla Taxes no existe. Intentando crearla...');
                try {
                    await db.executeQuery(`
                        CREATE TABLE dbo.Taxes (
                            id INT PRIMARY KEY,
                            name VARCHAR(100) NOT NULL,
                            type VARCHAR(20) NOT NULL,
                            percentage DECIMAL(10,2) NOT NULL,
                            accountCode VARCHAR(50) NOT NULL,
                            description VARCHAR(500)
                        )
                    `);
                    console.log('✅ Tabla Taxes creada correctamente');
                    
                    // Intentar insertar de nuevo
                    const result = await db.executeQuery(`
                        INSERT INTO dbo.Taxes (id, name, type, percentage, accountCode, description)
                        VALUES (@id, @name, @type, @percentage, @accountCode, @description);
                        SELECT @id AS id;
                    `, taxData);
                    
                    console.log('✅ Impuesto creado correctamente después de crear la tabla:', result);
                } catch (createError) {
                    console.error('❌ Error al crear la tabla Taxes:', createError);
                }
            }
        }
        
        // Paso 5: Verificar si el impuesto fue creado
        console.log('\n5. Verificando impuesto creado...');
        const newTax = await db.executeQuery('SELECT * FROM dbo.Taxes WHERE id = @id', { id: taxId });
        
        if (newTax && newTax.length > 0) {
            console.log('✅ Impuesto encontrado:');
            console.table(newTax);
        } else {
            console.log('❌ No se encontró el impuesto creado');
        }
        
    } catch (error) {
        console.error('❌ ERROR GENERAL:', error);
    } finally {
        try {
            // Cerrar conexión
            console.log('\nCerrando conexión...');
            await db.closePool();
            console.log('✅ Conexión cerrada correctamente');
        } catch (closeError) {
            console.error('❌ Error al cerrar la conexión:', closeError);
        }
    }
    
    console.log('\n=== FIN DE PRUEBA ===');
}

// Ejecutar la prueba
testTaxAPI(); 