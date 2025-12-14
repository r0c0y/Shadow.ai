#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building Agent Zero Chrome Extension...\n');

// Clean build directory
const buildDir = path.join(__dirname, '../build');
if (fs.existsSync(buildDir)) {
  fs.rmSync(buildDir, { recursive: true });
  console.log('✅ Cleaned build directory');
}

// Create build directory
fs.mkdirSync(buildDir, { recursive: true });

try {
  // Run Plasmo build
  console.log('📦 Running Plasmo build...');
  execSync('npx plasmo build', { 
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit' 
  });
  
  console.log('✅ Plasmo build completed');

  // Copy additional assets
  const assetsDir = path.join(__dirname, '../assets');
  const buildAssetsDir = path.join(buildDir, 'assets');
  
  if (fs.existsSync(assetsDir)) {
    fs.mkdirSync(buildAssetsDir, { recursive: true });
    
    // Copy all files from assets directory
    const assetFiles = fs.readdirSync(assetsDir);
    assetFiles.forEach(file => {
      const srcPath = path.join(assetsDir, file);
      const destPath = path.join(buildAssetsDir, file);
      fs.copyFileSync(srcPath, destPath);
    });
    
    console.log('✅ Copied asset files');
  }

  // Validate build
  const manifestPath = path.join(buildDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error('manifest.json not found in build directory');
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  console.log(`✅ Build validation passed - Extension v${manifest.version}`);

  // Generate build info
  const buildInfo = {
    version: manifest.version,
    buildTime: new Date().toISOString(),
    gitCommit: process.env.GITHUB_SHA || 'unknown',
    environment: process.env.NODE_ENV || 'development'
  };

  fs.writeFileSync(
    path.join(buildDir, 'build-info.json'),
    JSON.stringify(buildInfo, null, 2)
  );

  console.log('\n🎉 Build completed successfully!');
  console.log(`📁 Build output: ${buildDir}`);
  console.log(`🔧 Version: ${buildInfo.version}`);
  console.log(`⏰ Build time: ${buildInfo.buildTime}`);
  
  console.log('\n📋 Next steps:');
  console.log('1. Load unpacked extension in Chrome (chrome://extensions/)');
  console.log('2. Enable Developer mode');
  console.log(`3. Click "Load unpacked" and select: ${buildDir}`);

} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}