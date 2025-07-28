import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';

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

async function createTestData() {
  try {
    console.log('Creating test data for member query...');

    // Create workspace role with all permissions
    const workspaceRole = await client.workspace_role.upsert({
      where: { id: 'role_def' },
      update: {
        permissions: [
          'HELLO',
          'WORLD',
        ]
      },
      create: {
        id: 'role_def',
        name: 'Editor',
        permissions: [
          'HELLO',
          'WORLD',
        ]
      }
    });

    // Create workspace member
    const workspaceMember = await client.workspace_member.upsert({
      where: {
        id: 'wm_ghi'
      },
      update: {},
      create: {
        id: 'wm_ghi',
      }
    });

    // Connect workspace member to role
    await client.workspace_member.update({
      where: { id: workspaceMember.id },
      data: {
        roles: {
          connect: { id: workspaceRole.id }
        }
      }
    });

    console.log('Test data created successfully!');

  } catch (error) {
    console.error('Failed to create test data:', error);
    throw error;
  } finally {
    await client.$disconnect();
  }
}

// Run the script
createTestData()
  .then(() => {
    console.log('Test data creation completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Test data creation failed:', error);
    process.exit(1);
  });