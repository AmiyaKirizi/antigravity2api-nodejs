#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const envFile = path.join(rootDir, '.env');
const configFile = path.join(rootDir, 'config.json');
const envExample = path.join(rootDir, '.env.example');
const configExample = path.join(rootDir, 'config.json.example');

console.log('🐳 Starting Docker image build...\n');

// 检查并复制 .env
if (!fs.existsSync(envFile)) {
  if (fs.existsSync(envExample)) {
    fs.copyFileSync(envExample, envFile);
    console.log('✓ Created .env from .env.example');
  } else {
    console.warn('⚠ .env.example not found, using default configuration');
  }
} else {
  console.log('✓ .env already exists');
}

// 检查并复制 config.json
if (!fs.existsSync(configFile)) {
  if (fs.existsSync(configExample)) {
    fs.copyFileSync(configExample, configFile);
    console.log('✓ Created config.json from config.json.example');
  } else {
    console.warn('⚠ config.json.example not found, using default configuration');
  }
} else {
  console.log('✓ config.json already exists');
}

// 确保必要的目录存在（防止 Docker 挂载时创建文件夹）
const dataDir = path.join(rootDir, 'data');
const imagesDir = path.join(rootDir, 'public', 'images');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✓ Created data directory');
}

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log('✓ Created public/images directory');
}

// 构建镜像
console.log('\n📦 Building image...\n');
try {
  execSync('docker compose build', { 
    cwd: rootDir, 
    stdio: 'inherit' 
  });
  console.log('\n✅ Image build completed successfully!');
  console.log('\nRun the following command to start the service:');
  console.log('  docker compose up -d');
} catch (error) {
  console.error('\n❌ Build failed');
  process.exit(1);
}
