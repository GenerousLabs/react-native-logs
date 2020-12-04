import { fileTransportFactory } from '../fileTransportFactory';

declare var require: any;

const FileSystem = require('expo-file-system');

const basePath = (FileSystem && FileSystem.documentDirectory) || '';

const getExistingFileContents = async (filepath: string) => {
  try {
    // NOTE: We need the `await` here for this catch block to catch
    return await FileSystem.readAsStringAsync(filepath, {
      encoding: 'utf8',
    });
  } catch (error) {
    // In the event of any error (expo's error codes are impossible to discern),
    // check if the file exists, and if not, return an empty string, otherwise
    // re throw whatever error we caught.
    const stats = await FileSystem.getInfoAsync(filepath);
    if (!stats.exists) {
      return '';
    }
    throw error;
  }
};

const expoFileSystemAsync = fileTransportFactory(
  basePath,
  () => async (filepath, contents, encoding) => {
    const existingContents = await getExistingFileContents(filepath);
    const newContents = `${existingContents}${contents}`;
    await FileSystem.writeAsStringAsync(filepath, newContents, {
      encoding: 'utf8',
    });
  }
);

export { expoFileSystemAsync };
