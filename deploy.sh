#!/bin/bash

# 安装依赖
echo "Installing dependencies..."
npm install

# 构建前端
echo "Building frontend..."
cd packages/client
npm run build

# 构建后端
echo "Building backend..."
cd ../api
npm run build

# 部署前端到 Cloudflare Pages
echo "Deploying frontend to Cloudflare Pages..."
npx wrangler pages deploy ../client/dist --project-name diet-app

# 部署后端到 Cloudflare Workers
echo "Deploying backend to Cloudflare Workers..."
npx wrangler deploy

echo "Deployment completed!" 
