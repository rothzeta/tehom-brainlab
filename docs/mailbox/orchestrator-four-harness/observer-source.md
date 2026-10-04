# Four-harness trial — observer source

Task: `orchestrator-four-harness`; author/role: parent experiment observer; date: 2026-10-03.

These are the exact temporary observer programs used for this experiment, preserved as evidence rather than installed repository commands. They depend only on Python standard library, Git, and existing Just/shell commands. Run them only after the named trial worktrees are clean and delivered. The first program records exact delivered revisions and subprocess outputs; the second records scope, cleanliness, canonical hashes, and the review-to-delivery relationship. Results are linked from [results.md](results.md).

## Acceptance observer

Temporary execution path: `/tmp/brainlab-orchestrator2-acceptance.py`. Select completed harnesses as arguments; omitted arguments select all four. It overwrites `/tmp/brainlab-orchestrator2-acceptance.json` with the selected cohort. It uses the same seven CLI probes as the earlier two-harness trial, then runs the worker's own suite and committed whitespace check. It does not silently pass a missing implementation.

```python
import json
from pathlib import Path
import shutil
import subprocess
import tempfile

def run(argv, cwd):
    return subprocess.run(argv, cwd=cwd, text=True, capture_output=True)

records = []
import sys
for kind in (sys.argv[1:] or ['claude', 'codex', 'omp', 'agy']):
    root = Path('/tmp/brainlab-orch2-' + kind)
    revision = run(['git', 'rev-parse', 'HEAD'], root).stdout.strip()
    checks = []
    def assert_result(label, result, expected=None, rejection=False):
        ok = (result.returncode != 0 and result.stdout == '' and 'usage' in result.stderr.lower()) if rejection else (result.returncode == 0 and result.stdout == str(expected) + '\n' and result.stderr == '')
        checks.append({'check':label,'passed':ok,'exit':result.returncode,'stdout':result.stdout,'stderr':result.stderr})
    assert_result('entry point from foreign cwd', run([str(root / 'bin/repo-root')], '/'), root)
    assert_result('just recipe', run(['just','repo-root'], root), root)
    assert_result('single argument rejected', run([str(root/'bin/repo-root'),'unexpected'], '/'), rejection=True)
    assert_result('multiple arguments rejected', run([str(root/'bin/repo-root'),'one','two'], '/'), rejection=True)
    with tempfile.TemporaryDirectory(prefix='brainlab root acceptance ') as temporary:
        fixture = Path(temporary) / 'checkout with spaces'
        for rel in ('bin/repo-root','scripts/repo-root.sh','justfile'):
            target = fixture / rel
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(root / rel, target)
        assert_result('spaced checkout from foreign cwd', run([str(fixture/'bin/repo-root')], '/'), fixture)
        assert_result('just in spaced checkout', run(['just','repo-root'], fixture), fixture)
        assert_result('spaced checkout rejects argument', run([str(fixture/'bin/repo-root'),'unexpected'], '/'), rejection=True)
    unit = run(['python3','-B','-m','unittest','discover','-s','scripts/tests','-p','test*.py','-v'], root)
    checks.append({'check':'worker black-box suite','passed':unit.returncode == 0 and 'Ran 0 tests' not in unit.stderr,'exit':unit.returncode,'stdout':unit.stdout,'stderr':unit.stderr})
    whitespace = run(['git','diff','--check','ccd0668',revision],root)
    checks.append({'check':'committed whitespace','passed':whitespace.returncode == 0,'exit':whitespace.returncode,'stdout':whitespace.stdout,'stderr':whitespace.stderr})
    records.append({'kind':kind,'tested_revision':revision,'checks':checks,'passed':all(c['passed'] for c in checks)})
Path('/tmp/brainlab-orchestrator2-acceptance.json').write_text(json.dumps(records,indent=2)+'\n')
print(json.dumps(records,indent=2))
raise SystemExit(0 if all(r['passed'] for r in records) else 1)
```

## Scope observer

Temporary execution path: `/tmp/brainlab-orchestrator2-scope.py`. Pass completed harness names as arguments. It overwrites `/tmp/brainlab-orchestrator2-scope.json`. Source-protected paths cannot pass via the allowlist; existing entry point/script contents are separately compared. Technical files must match the exact reviewed candidate identified in the worker report.

```python
import json,subprocess,hashlib,sys,re
from pathlib import Path
BASE='ccd0668c25af53d72a55c2148311b122d64ae036'
records=[]
def run(argv,root):return subprocess.run(argv,cwd=root,text=True,capture_output=True)
for kind in sys.argv[1:]:
 root=Path('/tmp/brainlab-orch2-'+kind)
 revision=run(['git','rev-parse','HEAD'],root).stdout.strip()
 names=run(['git','diff','--name-only',BASE,revision],root).stdout.splitlines()
 allowed={'README.md','justfile','bin/repo-root','scripts/repo-root.sh','docs/CURRENT.md','docs/TASK_LOGS.md'}
 unexpected=[n for n in names if n not in allowed and not n.startswith(('scripts/tests/','docs/mailbox/orch2-'+kind+'-repo-root/'))]
 branch=run(['git','branch','--show-current'],root).stdout.strip()
 status=run(['git','status','--porcelain'],root).stdout
 source_paths=run(['git','ls-tree','-r','--name-only',BASE,'--','bin','scripts'],root).stdout.splitlines()
 existing=run(['git','diff','--exit-code',BASE,revision,'--',*source_paths],root)
 digests={name:hashlib.sha256((root/name).read_bytes()).hexdigest() for name in ('.agents/agents/coordinator.md','.agents/skills/ruach-workflow-feature/SKILL.md')}
 report=(root/'docs/mailbox'/('orch2-'+kind+'-repo-root')/'reviewer.md').read_text()
 matches=re.findall(r'^revision:\s*([0-9a-f]{40})$',report,re.M)
 reviewed=matches[0] if matches else None
 ancestry=reviewed is not None and run(['git','merge-base','--is-ancestor',reviewed,revision],root).returncode==0
 technical_unchanged=reviewed is not None and run(['git','diff','--exit-code',reviewed,revision,'--','bin','scripts','justfile','README.md'],root).returncode==0
 records.append({'kind':kind,'reviewed_revision':reviewed,'reviewed_ancestor':ancestry,'technical_content_unchanged_since_review':technical_unchanged,'revision':revision,'branch':branch,'clean':not status,'unexpected_paths':unexpected,'changed_paths':names,'existing_commands_unchanged':existing.returncode==0,'canonical_sha256':digests,'passed':ancestry and technical_unchanged and not unexpected and not status and existing.returncode==0 and branch=='experiment/orch2-'+kind+'-delivery'})
Path('/tmp/brainlab-orchestrator2-scope.json').write_text(json.dumps(records,indent=2)+'\n')
print(json.dumps(records,indent=2))
raise SystemExit(0 if all(r['passed'] for r in records) else 1)
```

## Main evidence consistency

Executed as `python3 /tmp/brainlab-orchestrator2-evidence-check.py` before the evidence commit.

```python
import json, subprocess
from pathlib import Path
root = Path('/opt/dev/tehom-brainlab')
folder = root / 'docs/mailbox/orchestrator-four-harness'
expected = {'README.md', 'docs/CURRENT.md', 'docs/TASK_LOGS.md', 'docs/mailbox/README.md'} | {
    'docs/mailbox/orchestrator-four-harness/' + name for name in
    ['assignment.md', 'results.md', 'acceptance.json', 'scope.json', 'observer-source.md', 'agy-initial-scope-failure.json']
}
changed = set(subprocess.check_output(['git', 'diff', '--name-only', 'c430708'], cwd=root, text=True).splitlines()) | set(
    subprocess.check_output(['git', 'ls-files', '--others', '--exclude-standard'], cwd=root, text=True).splitlines()
)
assert changed == expected, (changed, expected)
acceptance = json.loads((folder / 'acceptance.json').read_text())
scope = json.loads((folder / 'scope.json').read_text())
assert len(acceptance) == len(scope) == 4
assert {r['kind'] for r in acceptance} == {'claude', 'codex', 'omp', 'agy'}
for record in scope:
    assert record['passed']
    match = next(x for x in acceptance if x['kind'] == record['kind'])
    assert match['passed'] and match['tested_revision'] == record['revision']
    actual = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd='/tmp/brainlab-orch2-' + record['kind'], text=True).strip()
    assert actual == record['revision']
    assert record['canonical_sha256']['.agents/agents/coordinator.md'] == '53abb258249d2f792eee3afd8588b931868230d111792d9670284b91b62ba99d'
    assert record['canonical_sha256']['.agents/skills/ruach-workflow-feature/SKILL.md'] == '8ac6428b30addc14ffaad7aed9596638574114286191e6d6e7e58e541c0bcf22'
print('PASS: exactly four documentation notes and six owned evidence artifacts; all four acceptance records match current deliveries and final scope records; canonical hashes unchanged.')
```
