import { fileTransportFactory } from '../fileTransportFactory';

declare var require: any;

const FileSystem = require('expo-file-system');

const basePath = (FileSystem && FileSystem.documentDirectory) || '';

const expoFsAsync = fileTransportFactory(
  basePath,
  () => async (filepath, contents, encoding) => {
    const existingContents = await FileSystem.readAsStringAsync(filepath, {
      encoding: 'utf8',
    });
    const newContents = `${existingContents}\n${contents}`;
    await FileSystem.writeAsStringAsync(filepath, newContents, {
      encoding: 'utf8',
    });
  }
);

export { expoFsAsync as rnFsFileAsync };
