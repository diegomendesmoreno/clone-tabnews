import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const queryVersion = "SELECT version();";
  const queryVersionResult = await database.query(queryVersion);
  const parsedQuery = queryVersionResult.rows[0].version.split(" ");
  const databaseVersion = parsedQuery[1];

  const queryMaxConnections = "SHOW max_connections;";
  const queryMaxConnectionsResult = await database.query(queryMaxConnections);
  const databaseMaxConnections =
    queryMaxConnectionsResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const queryOpenedConnections = `SELECT COUNT(*) FROM pg_stat_activity WHERE datname = $1;`;
  const queryOpenedConnectionsResult = await database.query({
    text: queryOpenedConnections,
    values: [databaseName],
  });
  const databaseOpenedConnections = queryOpenedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersion,
        max_connections: parseInt(databaseMaxConnections),
        opened_connections: parseInt(databaseOpenedConnections),
      },
    },
  });
}

export default status;
