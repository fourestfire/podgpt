const fs = require('fs');
const path = require('path');

// Define the path to the dist directory and the manifest.json file
const distPath = path.resolve(__dirname, 'dist');
const manifestPath = path.join(distPath, 'manifest.json');

// Function to recursively convert all filenames in a directory to lowercase
function lowercaseFilenames(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const oldPath = path.join(dir, file);
    const newPath = path.join(dir, file.toLowerCase());

    fs.renameSync(oldPath, newPath);

    if (fs.statSync(newPath).isDirectory()) {
      lowercaseFilenames(newPath);
    }
  }
}

// Convert all filenames in the dist directory to lowercase
lowercaseFilenames(distPath);

// Read the manifest.json file
fs.readFile(manifestPath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading file from disk: ${err}`);
  } else {
    // Parse the JSON data
    const manifest = JSON.parse(data);

    // Convert all filenames to lowercase
    for (const key in manifest) {
      if (manifest[key].file) {
        manifest[key].file = manifest[key].file.toLowerCase();
      }
      if (manifest[key].css) {
        manifest[key].css = manifest[key].css.map(filename => filename.toLowerCase());
      }
      if (manifest[key].assets) {
        manifest[key].assets = manifest[key].assets.map(filename => filename.toLowerCase());
      }
    }

    // Write the updated data back to the manifest.json file
    fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8', err => {
      if (err) {
        console.error(`Error writing file to disk: ${err}`);
      }
    });
  }
});