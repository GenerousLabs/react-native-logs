import { fileTransportFactory } from '../fileTransportFactory';

declare var require: any;

const RNFS = require('react-native-fs');

const basePath = (RNFS && RNFS.DocumentDirectoryPath) || '';

const rnFsFileAsync = fileTransportFactory(
  basePath,
  () => RNFS && RNFS.appendFile
);

export { rnFsFileAsync };
