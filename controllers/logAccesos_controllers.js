const oracledb = require('oracledb');
const dbConfig = require('../js/db');

exports.registrarAcceso = async (
    usuarioId,
    username,
    rol,
    accion,
    ip
) => {

    let connection;

    try {

        connection =
            await oracledb.getConnection(dbConfig);

        await connection.execute(
            `
            INSERT INTO LOG_ACCESOS
            (
                USUARIO_ID,
                USERNAME,
                ROL,
                ACCION,
                IP_CLIENTE
            )
            VALUES
            (
                :usuarioId,
                :username,
                :rol,
                :accion,
                :ip
            )
            `,
            {
                usuarioId,
                username,
                rol,
                accion,
                ip
            },
            {
                autoCommit: true
            }
        );

        console.log('Acceso registrado:', accion, username);


    } catch (error) {

        console.error(
            'Error registrando acceso:',
            error
        );

    } finally {

        if (connection)
            await connection.close();

    }

};