import { Client } from 'pg';

export function getDBConn() {
    const PGHOST = process.env.PGHOST || 'localhost';
    const PGPORT = process.env.PGPORT || '5432';
    const PGDATABASE = process.env.PGDATABASE || 'postgres';
    const PGPASSWORD = encodeURIComponent(process.env.PGPASSWORD ?? 'postgres');
    const PGUSER = process.env.PGUSER || 'postgres';
    const PGAPPNAME = process.env.PGAPPNAME ?? 'prisma';
    return {
        url: `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}?connection_limit=40&application_name=${PGAPPNAME}&connect_timeout=30&pool_timeout=30&socket_timeout=30`,
        PGHOST,
        PGPORT,
        PGDATABASE,
        PGPASSWORD,
        PGUSER,
    };
}

async function runRawQueries() {
  const client = new Client({
    connectionString: getDBConn().url,
  });

  try {
    await client.connect();

    // Query 1: Get workspace_member IDs
    const workspaceMemberQuery = `SELECT "public"."workspace_member"."id" FROM "public"."workspace_member" WHERE 1=1 OFFSET $1`;
    const workspaceMemberResult = await client.query(workspaceMemberQuery, ['0']);
    console.log(JSON.stringify(workspaceMemberResult.rows));

    // Query 2: Get roles with permissions for workspace members
    if (workspaceMemberResult.rows.length > 0) {
      const memberIds = workspaceMemberResult.rows.map(row => row.id);
      const placeholders = memberIds.map((_, i) => `$${i + 1}`).join(',');
      
      const rolesQuery = `
        SELECT "t1"."id", "t1"."name", "t1"."permissions", "t0"."A" AS "workspace_memberToworkspace_role@workspace_member" 
        FROM "public"."_workspace_memberToworkspace_role" AS "t0" 
        INNER JOIN "public"."workspace_role" AS "t1" ON "t0"."B" = "t1"."id" 
        WHERE "t0"."A" IN (${placeholders})
      `;
      
      const rolesResult = await client.query(rolesQuery, memberIds);
      console.log(JSON.stringify(rolesResult.rows));
    }

  } catch (error) {
    console.error('Query failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the queries
runRawQueries()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Raw queries failed:', error);
    process.exit(1);
  });