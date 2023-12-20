test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);
});

test("GET to /api/v1/status should return a valid updated_at date", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");

  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toBe(parsedUpdatedAt);
});

test("Should get database version and connections", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");

  const responseBody = await response.json();

  const version = responseBody.dependencies.database.version;
  expect(version).toBe("16.1");

  const maxConnections = responseBody.dependencies.database.max_connections;
  expect(maxConnections).toBe(100);

  const openedConnections =
    responseBody.dependencies.database.opened_connections;
  expect(openedConnections).toBe(1);
});
