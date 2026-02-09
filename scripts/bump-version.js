import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// 获取命令行参数
const versionType = process.argv[2] || 'patch';

if (!['patch', 'minor', 'major'].includes(versionType)) {
  console.error(`❌ 无效的版本类型: ${versionType}`);
  console.log('用法: node scripts/bump-version.js [patch|minor|major]');
  console.log('默认: patch');
  process.exit(1);
}

const packagePath = join(projectRoot, 'package.json');
const manifestPath = join(projectRoot, 'public', 'manifest.json');

const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
const currentVersion = packageJson.version;
const nextVersion = bumpVersion(currentVersion, versionType);

packageJson.version = nextVersion;
writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

if (existsSync(manifestPath)) {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  manifest.version = nextVersion;
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
} else {
  console.warn('⚠️  public/manifest.json 不存在，已仅更新 package.json');
}

console.log(`🔖 版本已从 ${currentVersion} 升级到 ${nextVersion} (${versionType})`);

function bumpVersion(version, type) {
  const match = /^([0-9]+)\.([0-9]+)\.([0-9]+)$/.exec(version);
  if (!match) {
    throw new Error(`不支持的版本号格式: ${version}. 期望格式: x.y.z`);
  }

  const major = Number(match[1]);
  const minor = Number(match[2]);
  const patch = Number(match[3]);

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`未知的版本类型: ${type}`);
  }
}
