import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

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

const getPg = () => {
    const adapter = new PrismaPg({ connectionString: getDBConn().url });
    return new PrismaClient({
        adapter,
        log: [{ emit: 'event', level: 'query' }],
    });
};

const client = getPg();

async function testMemberQuery() {
  try {
    console.log('Testing the exact query that is breaking...');

    const _ = await client.workspace_member.findMany({  
      include: {
        roles: true,
      }
    })

    console.log('Query executed successfully!');
    console.log('Found members:', _.length);
    console.log('Members data:', JSON.stringify(_, null, 2));
    
    return _;
  } catch (error) {
    console.error('Query failed:', error);
    throw error;
  } finally {
    await client.$disconnect();
  }
}

// Run the test
testMemberQuery()
  .then(() => {
    console.log('Member query test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Member query test failed:', error);
    process.exit(1);
  });