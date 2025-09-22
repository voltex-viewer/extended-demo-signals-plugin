import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createPackage() {
  const packageDir = path.join(__dirname, '../dist');
  const packageJsonPath = path.join(__dirname, '../package.json');
  const outputPath = path.join(__dirname, '../extended-demo-signals.vxpkg');

  // Ensure dist directory exists and contains built files
  if (!fs.existsSync(path.join(packageDir, 'index.js'))) {
    console.error('Build files not found. Run npm run build first.');
    process.exit(1);
  }

  // Read manifest data from package.json
  const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const manifest = {
    voltexApiVersion: packageData.dependencies['@voltex-viewer/plugin-api'],
    main: 'index.js',
    name: packageData.name,
    version: packageData.version
  };
  
  // Write generated manifest to dist directory
  fs.writeFileSync(
    path.join(packageDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log(`Generated manifest with:`);
  console.log(`  Name: ${manifest.name}`);
  console.log(`  Version: ${manifest.version}`);
  console.log(`  Voltex API Version: ${manifest.voltexApiVersion}`);

  // Create the plugin package
  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  archive.pipe(output);
  archive.directory(packageDir, false);
  
  await archive.finalize();

  console.log(`Plugin package created: ${outputPath}`);
  console.log(`Package size: ${fs.statSync(outputPath).size} bytes`);
}

createPackage().catch(console.error);