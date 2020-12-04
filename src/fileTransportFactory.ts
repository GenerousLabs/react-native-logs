import { transportFunctionType } from './';

type AppendFile = (
  filepath: string,
  contents: string,
  encoding?: string
) => Promise<void>;
type GetAppendFile = () => AppendFile | undefined;

const fileTransportFactory = (
  basePath: string,
  getAppendFile: GetAppendFile
): transportFunctionType => {
  const appendFile = getAppendFile();

  return (msg, level, options) => {
    if (typeof appendFile === 'undefined') {
      return false;
    }

    /**
     * Control msg type
     * Here we use JSON.stringify so you can pass object, array, string, ecc...
     */
    let stringMsg: string;
    if (typeof msg === 'string') {
      stringMsg = msg;
    } else if (typeof msg === 'function') {
      stringMsg = '[function]';
    } else {
      stringMsg = JSON.stringify(msg);
    }

    let dateTxt;
    if (options && options.dateFormat === 'utc') {
      dateTxt = `${new Date().toUTCString()} | `;
    } else if (options && options.dateFormat === 'iso') {
      dateTxt = `${new Date().toISOString()} | `;
    } else {
      dateTxt = `${new Date().toLocaleString()} | `;
    }

    let levelTxt = `${level.text.toUpperCase()} | `;
    let loggerName = 'rnlogs';
    let loggerPath = basePath;

    if (options && options.hideDate) dateTxt = '';
    if (options && options.hideLevel) levelTxt = '';
    if (options && options.loggerName) loggerName = options.loggerName;
    if (options && options.loggerPath) loggerPath = options.loggerPath;

    let output = `${dateTxt}${levelTxt}${stringMsg}\n`;
    var path = loggerPath + '/' + loggerName + '.txt';

    appendFile(path, output, 'utf8')
      .then(() => {})
      .catch((err: any) => {
        console.error(err);
      });
  };
};

export { fileTransportFactory };
