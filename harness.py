import numpy as np
import numpy.linalg as la
import sys, io, json, types, math, random, copy, traceback


def _lu(A):
    A = np.array(A, dtype=float)
    n = A.shape[0]
    Pm = np.eye(n)
    L = np.eye(n)
    U = A.copy()
    for k in range(n - 1):
        p = k + int(np.argmax(np.abs(U[k:, k])))
        if p != k:
            U[[k, p], :] = U[[p, k], :]
            Pm[[k, p], :] = Pm[[p, k], :]
            L[[k, p], :k] = L[[p, k], :k]
        if U[k, k] == 0:
            continue
        for i in range(k + 1, n):
            L[i, k] = U[i, k] / U[k, k]
            U[i, :] = U[i, :] - L[i, k] * U[k, :]
    return Pm.T, L, U


def _solve_triangular(a, b, trans=0, lower=False, unit_diagonal=False, **kw):
    a = np.array(a, dtype=float)
    b = np.array(b, dtype=float)
    if trans in (1, 'T'):
        a = a.T
        lower = not lower
    n = a.shape[0]
    x = np.zeros_like(b, dtype=float)
    order = range(n) if lower else range(n - 1, -1, -1)
    for i in order:
        if lower:
            s = a[i, :i] @ x[:i]
        else:
            s = a[i, i + 1:] @ x[i + 1:]
        d = 1.0 if unit_diagonal else a[i, i]
        x[i] = (b[i] - s) / d
    return x


_sp = types.ModuleType('scipy')
_spl = types.ModuleType('scipy.linalg')
_spl.lu = _lu
_spl.solve_triangular = _solve_triangular
_spl.inv = la.inv
_spl.solve = la.solve
_spl.det = la.det
_spl.norm = la.norm
_spl.eig = la.eig
_spl.svd = la.svd
_spl.lstsq = la.lstsq
_sp.linalg = _spl
sys.modules['scipy'] = _sp
sys.modules['scipy.linalg'] = _spl

_ORIG = {
    'solve': np.linalg.solve,
    'inv': np.linalg.inv,
    'matrix_power': np.linalg.matrix_power,
    'lu': _lu,
    'solve_triangular': _solve_triangular,
}
_MODS = {'numpy.linalg': np.linalg, 'scipy.linalg': _spl, 'numpy': np}


def _ban(names):
    saved = []
    for full in names:
        mod, attr = full.rsplit('.', 1)
        m = _MODS[mod]
        saved.append((m, attr, getattr(m, attr)))
        shown = full.replace('numpy.linalg', 'np.linalg').replace('numpy.', 'np.')

        def _blocked(*a, _n=shown, **k):
            raise RuntimeError(_n + '() is not allowed in this question')
        setattr(m, attr, _blocked)
    return saved


def _unban(saved):
    for m, attr, f in saved:
        setattr(m, attr, f)


def _cmp(got, exp, tol=1e-6):
    if isinstance(exp, tuple):
        if got is None:
            return False, 'is None (did you forget to return?)'
        if not isinstance(got, (tuple, list)):
            return False, 'should be a tuple of %d items, but it is a %s' % (len(exp), type(got).__name__)
        if len(got) != len(exp):
            return False, 'should have %d items, but it has %d' % (len(exp), len(got))
        for i, (g, e) in enumerate(zip(got, exp)):
            ok, m = _cmp(g, e, tol)
            if not ok:
                return False, '(item %d) %s' % (i, m)
        return True, ''
    if isinstance(exp, (bool, np.bool_)):
        if not isinstance(got, (bool, np.bool_)):
            return False, 'should be True or False, but it is a %s' % type(got).__name__
        if bool(got) != bool(exp):
            return False, 'is incorrect'
        return True, ''
    if got is Ellipsis:
        return False, 'is still ... (you have not set it yet)'
    if got is None:
        return False, 'is None (did you forget to return or assign it?)'
    if callable(got):
        return False, 'is a function, but a value was expected'
    try:
        g = np.asarray(got, dtype=float)
    except Exception:
        return False, 'should be numeric, but it is a %s' % type(got).__name__
    e = np.asarray(exp, dtype=float)
    if g.shape != e.shape:
        return False, 'has shape %s, expected shape %s' % (g.shape, e.shape)
    if e.size and np.all(np.isfinite(e)) and not np.all(np.isfinite(g)):
        return False, 'contains nan or inf'
    scale = max(1.0, float(np.max(np.abs(e)))) if e.size else 1.0
    if not np.allclose(g, e, rtol=tol, atol=tol * scale):
        return False, 'has incorrect values'
    return True, ''


def _fmt(ex, src=''):
    if isinstance(ex, SyntaxError):
        return 'SyntaxError: %s (line %s)\n    %s' % (ex.msg, ex.lineno, (ex.text or '').rstrip())
    tb = traceback.extract_tb(ex.__traceback__)
    srcl = src.split('\n')
    def _txt(fr):
        if fr.line:
            return fr.line.strip()
        return srcl[fr.lineno - 1].strip() if 0 < fr.lineno <= len(srcl) else ''
    lines = ['  line %s: %s' % (fr.lineno, _txt(fr)) for fr in tb if fr.filename == 'user_code.py']
    head = 'Traceback (your code):\n' + '\n'.join(lines) + '\n' if lines else ''
    return head + type(ex).__name__ + ': ' + str(ex)


class _Grader:
    def __init__(self, U, src=''):
        self.U = U
        self.src = src
        self.items = []
        self.trace = None

    def _add(self, name, ok, pts, msg):
        self.items.append({'name': name, 'ok': bool(ok), 'pts': pts if ok else 0, 'max': pts, 'msg': msg})

    def expect(self, name, exp, pts, tol=1e-6, label=None):
        lab = label or name
        if name not in self.U:
            self._add(lab, False, pts, '%s is not defined' % name)
            return
        ok, m = _cmp(self.U[name], exp, tol)
        self._add(lab, ok, pts, ('%s is correct' % lab) if ok else ('%s %s' % (lab, m)))

    def expect_fn(self, name, cases, ref, pts, tol=1e-6):
        f = self.U.get(name)
        if f is None or not callable(f):
            self._add(name + '()', False, pts, 'function %s is not defined' % name)
            return
        for i, args in enumerate(cases):
            exp = ref(*copy.deepcopy(args))
            try:
                got = f(*copy.deepcopy(args))
            except Exception as ex:
                self._add(name + '()', False, pts, '%s raised %s on test %d of %d: %s' % (name, type(ex).__name__, i + 1, len(cases), ex))
                self.trace = _fmt(ex, self.src)
                return
            ok, m = _cmp(got, exp, tol)
            if not ok:
                self._add(name + '()', False, pts, 'return value of %s %s (test %d of %d)' % (name, m, i + 1, len(cases)))
                return
        self._add(name + '()', True, pts, '%s passed all %d tests' % (name, len(cases)))


def _run(setup_src, user_src, check_src, seed, params_json, banned_json):
    res = {'stdout': '', 'error': None, 'items': [], 'score': 0}
    params = json.loads(params_json)
    banned = json.loads(banned_json)
    seed = int(seed)
    np.random.seed(seed % (2 ** 32))
    random.seed(seed)
    S = {'np': np, 'la': la, 'PARAMS': params, 'math': math}
    exec(setup_src, S)
    S = {k: v for k, v in S.items() if not k.startswith('__')}
    U = {'__name__': '__main__'}
    for k, v in S.items():
        if k in ('PARAMS', 'np', 'la', 'math') or isinstance(v, types.ModuleType):
            continue
        U[k] = v if callable(v) else copy.deepcopy(v)
    buf = io.StringIO()
    old = sys.stdout, sys.stderr
    saved = _ban(banned)
    G = _Grader(U, user_src)
    try:
        sys.stdout = buf
        sys.stderr = buf
        try:
            code = compile(user_src, 'user_code.py', 'exec')
            exec(code, U)
        except BaseException as ex:
            res['error'] = _fmt(ex, user_src)
        finally:
            sys.stdout, sys.stderr = old
        res['stdout'] = buf.getvalue()[-8000:]
        if res['error'] is None:
            np.random.seed((seed * 7919 + 13) % (2 ** 32))
            C = {'np': np, 'la': la, 'S': S, 'U': U, 'G': G, 'ORIG': _ORIG, 'math': math, 'copy': copy}
            try:
                sys.stdout = io.StringIO()
                exec(check_src, C)
            except Exception as ex:
                G._add('grader', False, 0, 'Grading stopped: %s: %s' % (type(ex).__name__, ex))
            finally:
                sys.stdout, sys.stderr = old
    finally:
        _unban(saved)
    if G.trace and not res['error']:
        res['trace'] = G.trace
    res['items'] = G.items
    res['score'] = sum(i['pts'] for i in G.items)
    return json.dumps(res, default=str)
