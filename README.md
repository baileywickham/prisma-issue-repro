# Prisma repro

## Repro
Run `./test-member-setup.sh` to repro the issue. Check the prisma schema for the enabled options and table layout.


Stack trace of the query
```
Query failed: TypeError: e.map is not a function
    at mapValue (/Users/baileywickham/workspace/prisma-test-bad/node_modules/.pnpm/@prisma+client@6.12.0_prisma@6.12.0_typescript@5.8.3__typescript@5.8.3/node_modules/@prisma/client-engine-runtime/src/interpreter/DataMapper.ts:223:21)
    at mapObject (/Users/baileywickham/workspace/prisma-test-bad/node_modules/.pnpm/@prisma+client@6.12.0_prisma@6.12.0_typescript@5.8.3__typescript@5.8.3/node_modules/@prisma/client-engine-runtime/src/interpreter/DataMapper.ts:95:28)
    at row (/Users/baileywickham/workspace/prisma-test-bad/node_modules/.pnpm/@prisma+client@6.12.0_prisma@6.12.0_typescript@5.8.3__typescript@5.8.3/node_modules/@prisma/client-engine-runtime/src/interpreter/DataMapper.ts:39:30)
    at Array.map (<anonymous>)
    at mapArrayOrObject (/Users/baileywickham/workspace/prisma-test-bad/node_modules/.pnpm/@prisma+client@6.12.0_prisma@6.12.0_typescript@5.8.3__typescript@5.8.3/node_modules/@prisma/client-engine-runtime/src/interpreter/DataMapper.ts:39:17)
    at mapObject (/Users/baileywickham/workspace/prisma-test-bad/node_modules/.pnpm/@prisma+client@6.12.0_prisma@6.12.0_typescript@5.8.3__typescript@5.8.3/node_modules/@prisma/client-engine-runtime/src/interpreter/DataMapper.ts:87:24)
    at row (/Users/baileywickham/workspace/prisma-test-bad/node_modules/.pnpm/@prisma+client@6.12.0_prisma@6.12.0_typescript@5.8.3__typescript@5.8.3/node_modules/@prisma/client-engine-runtime/src/interpreter/DataMapper.ts:39:30)
    at Array.map (<anonymous>)
    at mapArrayOrObject (/Users/baileywickham/workspace/prisma-test-bad/node_modules/.pnpm/@prisma+client@6.12.0_prisma@6.12.0_typescript@5.8.3__typescript@5.8.3/node_modules/@prisma/client-engine-runtime/src/interpreter/DataMapper.ts:39:17)
    at bl (/Users/baileywickham/workspace/prisma-test-bad/node_modules/.pnpm/@prisma+client@6.12.0_prisma@6.12.0_typescript@5.8.3__typescript@5.8.3/node_modules/@prisma/client-engine-runtime/src/interpreter/DataMapper.ts:20:14) {
  clientVersion: '6.12.0'
}
```