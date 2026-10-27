/* Python runner: Pyodide + NumPy in a worker, so a runaway loop can be stopped. */
const HARNESS = String.raw`__HARNESS__`;
let py = null;

/* Artifacts can't serve .zip/.whl, so those files are published with a .wasm suffix. */
const _fetch = self.fetch.bind(self);
self.fetch = (url, opts) => {
  let u = typeof url === 'string' ? url : (url && url.url) || String(url);
  if (/\.(whl|zip)(\?|$)/.test(u)) u = u.replace(/\.(whl|zip)(\?|$)/, '.$1.wasm$2');
  return _fetch(u, opts);
};

async function boot() {
  try {
    postMessage({ type: 'status', text: 'Starting Python' });
    importScripts('pyodide/pyodide.js');
    const base = new URL('pyodide/', self.location.href).href;
    const hang = new Promise((_, rej) => setTimeout(() => rej(new Error('Python took too long to start')), 90000));
    py = await Promise.race([loadPyodide({ indexURL: base, stdout: () => {}, stderr: () => {} }), hang]);
    postMessage({ type: 'status', text: 'Loading NumPy' });
    await py.loadPackage('numpy', { messageCallback: () => {}, errorCallback: () => {} });
    py.runPython(HARNESS);
    const ver = py.runPython('import numpy, sys; numpy.__version__ + "|" + sys.version.split()[0]');
    postMessage({ type: 'ready', numpy: ver.split('|')[0], python: ver.split('|')[1] });
  } catch (e) {
    py = null;
    postMessage({ type: 'fatal', text: String((e && e.message) || e) });
  }
}
const booted = boot();

onmessage = async (ev) => {
  const m = ev.data;
  await booted;
  if (!py) {
    postMessage({ type: 'result', id: m.id, result: { error: 'Python is not available in this browser.', items: [], score: 0, stdout: '' } });
    return;
  }
  try {
    const run = py.globals.get('_run');
    const out = run(m.setup, m.user, m.check, m.seed, JSON.stringify(m.params || {}), JSON.stringify(m.banned || []));
    run.destroy();
    postMessage({ type: 'result', id: m.id, result: JSON.parse(out) });
  } catch (e) {
    postMessage({ type: 'result', id: m.id, result: { error: 'Internal grader error: ' + String((e && e.message) || e), items: [], score: 0, stdout: '' } });
  }
};
