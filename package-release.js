import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '.');

console.log('🚀 开始打包 iTools 扩展...');

// 1. 确保构建是最新的
console.log('📦 执行生产构建...');
try {
  execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });
} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
}

// 2. 创建发布目录
const releaseDir = join(projectRoot, 'release');
const tempDir = join(releaseDir, 'temp');

if (existsSync(releaseDir)) {
  console.log('🗑️  清理旧的发布目录...');
  execSync(`rm -rf ${releaseDir}`, { cwd: projectRoot });
}

mkdirSync(releaseDir, { recursive: true });
mkdirSync(tempDir, { recursive: true });

// 3. 复制构建文件
console.log('📋 复制构建文件...');

const distDir = join(projectRoot, 'dist');
if (!existsSync(distDir)) {
  console.error('❌ dist 目录不存在，请确保构建成功');
  process.exit(1);
}

// 复制 dist 目录下的所有内容到 temp 目录
copyDirectory(distDir, tempDir);

// 4. 创建发布信息文件
console.log('📝 创建发布信息...');
let manifest;
try {
  manifest = JSON.parse(
    readFileSync(join(tempDir, 'manifest.json'), 'utf8')
  );
} catch (e) {
  console.warn('⚠️  manifest.json 未在构建输出中找到，尝试从 public 读取');
  try {
     manifest = JSON.parse(readFileSync(join(projectRoot, 'public', 'manifest.json'), 'utf8'));
  } catch (err) {
      manifest = { name: 'itools', version: '0.0.0' };
  }
}

const packageJson = JSON.parse(
  readFileSync(join(projectRoot, 'package.json'), 'utf8')
);

// 如果 manifest 中的 version 和 package.json 不一致，警告一下（可选）
if (manifest.version !== packageJson.version) {
  console.log(`⚠️  注意: Manifest 版本 (${manifest.version}) 与 Package 版本 (${packageJson.version}) 不一致`);
}

const releaseInfo = {
  name: manifest.name || packageJson.name,
  version: manifest.version || packageJson.version,
  description: manifest.description || packageJson.description,
  buildTime: new Date().toISOString(),
  files: listFiles(tempDir, tempDir),
  gitCommit: getGitCommit(),
  packageVersion: packageJson.version
};

writeFileSync(
  join(tempDir, 'release-info.json'),
  JSON.stringify(releaseInfo, null, 2)
);

// 5. 创建 zip 包
console.log('🗜️  创建 zip 包...');
const safeName = (manifest.name || packageJson.name || 'itools').toLowerCase().replace(/\s+/g, '-');
const zipName = `${safeName}-v${manifest.version || packageJson.version}.zip`;
const zipPath = join(releaseDir, zipName);

try {
  // cd into tempDir so files are at root of zip
  execSync(`cd ${tempDir} && zip -r ../${zipName} .`, { stdio: 'inherit' });
  console.log(`✅ 打包完成: ${zipPath}`);
} catch (error) {
  console.error('❌ 打包失败:', error.message);
  process.exit(1);
}

// 6. 验证 zip 包
console.log('🔍 验证 zip 包...');
try {
  const output = execSync(`unzip -l ${zipPath}`, { encoding: 'utf8' });
  const fileCount = output.split('\n').filter(line => line.trim() && !line.includes('Archive:') && !line.includes('files')).length - 1;
  console.log(`📊 zip 包包含 ${fileCount} 个文件`);
} catch (error) {
  console.error('❌ zip 包验证失败:', error.message);
}

// 7. 清理临时文件
console.log('🧹 清理临时文件...');
execSync(`rm -rf ${tempDir}`);

// 8. 显示总结
console.log('\n🎉 打包完成！');
console.log('📋 发布清单:');
console.log(`   扩展名称: ${manifest.name}`);
console.log(`   版本号: ${manifest.version}`);
console.log(`   文件大小: ${getFileSize(zipPath)}`);
console.log(`   包位置: ${zipPath}`);

// 工具函数
function copyDirectory(src, dest) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }

  const items = readdirSync(src);
  for (const item of items) {
    const srcPath = join(src, item);
    const destPath = join(dest, item);
    
    if (statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

function listFiles(dir, baseDir) {
  const files = [];
  const items = readdirSync(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const relativePath = fullPath.replace(baseDir + '/', '');
    
    if (statSync(fullPath).isDirectory()) {
      files.push(...listFiles(fullPath, baseDir));
    } else {
      files.push(relativePath);
    }
  }
  
  return files;
}

function getFileSize(filePath) {
  const stats = statSync(filePath);
  const bytes = stats.size;
  
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getGitCommit() {
    try {
        return execSync('git rev-parse --short HEAD').toString().trim();
    } catch {
        return 'unknown';
    }
} 