# 257 Quiz Simulator

Practice site for MATH 257 Python Quiz 1 (Labs 1–6). Code runs on real NumPy in the browser through Pyodide and is autograded with fresh random data on every run.

- **Moves:** 24 short drills, one core NumPy pattern each
- **Problems:** 36 quiz-style problems (every CL lab notebook and CHW coding problem from Labs 1-6), each tagged with the moves it uses
- **Mock quiz:** 4 problems from 4 labs, course doc only, no hints

## Run locally

```
python3 build.py
python3 -m http.server 8765
```

Then open http://localhost:8765/index.html.

## Files

- `index.src.html`: page source (UI and logic)
- `questions.js`, `drills.js`: problem bank (prompt, setup, checker, solution)
- `harness.py`: Python grader that runs inside the worker
- `worker.src.js`: Pyodide web worker
- `build.py`: builds `index.html` and `worker.js`
- `pyodide/`: Pyodide 0.26.4 runtime and NumPy wheel (`.zip`/`.whl` files carry a `.wasm` suffix so static hosts serve them)
- `test_bank.py`, `dump.js`: checks every reference solution scores 10/10 (`node dump.js && python3 test_bank.py`)
