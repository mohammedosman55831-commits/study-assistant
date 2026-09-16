/**
 * Client-Side Real Python Execution Engine powered by Pyodide (WebAssembly)
 * - Loads on demand on the first run to keep initial page loads fast.
 * - Captures stdout, stderr, and authentic Python tracebacks.
 * - Supports interactive input() via browser prompt.
 */

let pyodideInstance = null;
let pyodideLoadingPromise = null;

const PYODIDE_CDN_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
const PYODIDE_INDEX_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';

/**
 * Dynamically injects the Pyodide CDN script if not already present.
 */
function loadPyodideScript() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('Pyodide can only run in the browser.'));
    }

    if (window.loadPyodide) {
      return resolve();
    }

    const existingScript = document.querySelector(`script[src="${PYODIDE_CDN_URL}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', (err) => reject(err));
      return;
    }

    const script = document.createElement('script');
    script.src = PYODIDE_CDN_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Pyodide WebAssembly runtime from CDN. Please check your internet connection.'));
    document.head.appendChild(script);
  });
}

/**
 * Initializes and returns the cached Pyodide instance.
 */
export async function getPyodideInstance(onStatus) {
  if (pyodideInstance) {
    return pyodideInstance;
  }

  if (pyodideLoadingPromise) {
    return pyodideLoadingPromise;
  }

  pyodideLoadingPromise = (async () => {
    try {
      if (onStatus) onStatus('Downloading Python WebAssembly runtime...');
      await loadPyodideScript();

      if (onStatus) onStatus('Initializing Python 3.12 environment...');
      const pyodide = await window.loadPyodide({
        indexURL: PYODIDE_INDEX_URL,
      });

      pyodideInstance = pyodide;
      return pyodide;
    } catch (err) {
      pyodideLoadingPromise = null;
      throw err;
    }
  })();

  return pyodideLoadingPromise;
}

/**
 * Executes Python code using Pyodide and returns formatted output lines.
 *
 * @param {string} code - The Python source code to execute.
 * @param {Function} onStatus - Status update callback (e.g. 'Loading Python...').
 * @returns {Promise<{ outputs: string[], isError: boolean }>}
 */
export async function runPythonCode(code, onStatus) {
  const outputs = [];

  try {
    const pyodide = await getPyodideInstance(onStatus);

    if (onStatus) onStatus('Executing Python code...');

    // Redirect stdout and stderr
    pyodide.setStdout({
      batched: (text) => {
        if (text !== undefined && text !== null) {
          outputs.push(String(text));
        }
      },
    });

    pyodide.setStderr({
      batched: (text) => {
        if (text !== undefined && text !== null) {
          outputs.push(`❌ ${String(text)}`);
        }
      },
    });

    // Provide interactive input() handling via window.prompt
    pyodide.setStdin({
      stdin: () => {
        const userInput = window.prompt('Python input():\nEnter a value for your program:');
        return userInput !== null ? userInput : '';
      },
    });

    // Execute the Python code asynchronously
    await pyodide.runPythonAsync(code);

    if (outputs.length === 0) {
      outputs.push('(Program executed successfully with no output)');
    }

    return { outputs, isError: false };
  } catch (err) {
    let errorMsg = err.message || String(err);

    // Clean up Pyodide internal stack traces to show user-friendly Python errors
    if (errorMsg.includes('PythonError:')) {
      const parts = errorMsg.split('PythonError:');
      errorMsg = parts[parts.length - 1].trim();
    }

    const lines = errorMsg.split('\n').map((line) => `❌ ${line}`);
    return { outputs: lines, isError: true };
  }
}
