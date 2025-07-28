#!/bin/bash

# Exit on any error
set -e

echo "🚀 Setting up member query test..."

echo "📋 Generating Prisma client..."
pnpm generate

echo "🗄️ Creating database schema..."
npx prisma db push --skip-generate

echo "🌱 Creating test data..."
npx tsx create-member-test-data.ts

echo "🔍 Running member query test..."
npx tsx member-query-test.ts

echo "✅ Member query test completed!"