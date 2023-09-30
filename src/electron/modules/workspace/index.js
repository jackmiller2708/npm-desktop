const { Subject, switchMap, tap, buffer, debounceTime } = require("rxjs");
const { getPackageReader, getPackageWatcher } = require("./_service");

function loadWorkspace(workspace) {
  const buffer$ = new Subject();

  return getPackageWatcher(workspace.path).pipe(
    switchMap(() =>
      getPackageReader(workspace.path).pipe(
        tap(() => buffer$.next()),
        buffer(buffer$.pipe(debounceTime(100)))
      )
    )
  );
}

module.exports = { loadWorkspace };
