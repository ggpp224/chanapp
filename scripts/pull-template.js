/**
 * Created by guopeng on 2016/10/10.
 */

const path = require('path'); 
const fs = require('fs-extra');
const child_process = require('child_process');
const root = process.cwd();
const tmpPath = path.join(root, '_tmp');
const tplAppPath = path.join(root, 'app/templates/app');

fs.emptyDirSync(tmpPath);
process.chdir(tmpPath);
child_process.execSync('git clone git@github.com:ggpp224/react-boilerpate.git');

fs.removeSync(tplAppPath);
fs.copySync(path.join(tmpPath, 'react-boilerpate'), tplAppPath);

fs.removeSync(tmpPath);