import json, sys
sys.path.insert(0, '.')
import harness
D = json.load(open('dump.json'))
bad = 0
for d in D:
    r = json.loads(harness._run(d['setup'], d['solution'], d['check'], d['seed'], json.dumps(d['params']), json.dumps(d['banned'])))
    s = json.loads(harness._run(d['setup'], d['starter'], d['check'], d['seed'], json.dumps(d['params']), json.dumps(d['banned'])))
    tot = sum(i['max'] for i in r['items'])
    if r['error'] or r['score'] != 10 or tot != 10:
        bad += 1
        print('FAIL', d['id'], d['seed'], r['error'], r['score'], tot, [i['msg'] for i in r['items'] if not i['ok']])
    if s['score'] > 0:
        print('STARTER SCORES', d['id'], s['score'])
print('done', len(D), 'bad', bad)
# show starter feedback example
d = D[0]
print(harness._run(d['setup'], d['starter'], d['check'], d['seed'], json.dumps(d['params']), json.dumps(d['banned']))[:400])
d = [x for x in D if x['id']=='l4-rod'][0]
print(harness._run(d['setup'], 'import numpy as np\nA=np.eye(n)\nb=np.ones(n)\nT=np.linalg.solve(A,b)\n', d['check'], d['seed'], json.dumps(d['params']), json.dumps(d['banned'])))
