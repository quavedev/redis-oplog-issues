import Config from './config';

export default (message, trace = false) => {
  if (Config.debug) {
    const timestamp = new Date().getTime();
    console.debug(`[${timestamp}] - ` + message);

    if (trace) {
      console.debug(trace);
    }
  }
};
