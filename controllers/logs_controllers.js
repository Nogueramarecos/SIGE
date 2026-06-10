const oracledb = require('oracledb');
const dbConfig = require('../js/db');

exports.listarLogs = async (req, res) => {

    let connection;

    try {

        connection =
            await oracledb.getConnection(dbConfig);

        const result =
            await connection.execute(
                `
                SELECT
                    LOG_ID,
                    USERNAME,
                    ROL,
                    ACCION,
                    TO_CHAR(
                        FECHA_ACCESO,
                        'DD/MM/YYYY HH24:MI:SS'
                    ) FECHA_ACCESO,
                    IP_CLIENTE
                FROM LOG_ACCESOS
                ORDER BY LOG_ID DESC
                `,
                [],
                {
                    outFormat:
                    oracledb.OUT_FORMAT_OBJECT
                }
            );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    } finally {

        if (connection)
            await connection.close();

    }

};