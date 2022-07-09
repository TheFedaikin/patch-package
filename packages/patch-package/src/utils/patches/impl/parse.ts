    .match(/^@@ -(\d+)(,(\d+))? \+(\d+)(,(\d+))? @@.*/);
    throw new Error(`Bad header line: '${headerLine}'`);
  };
};
export const NON_EXECUTABLE_FILE_MODE = 0o644;
export const EXECUTABLE_FILE_MODE = 0o755;
  type: 'context' | 'insertion' | 'deletion'
  type: 'rename'
  type: 'mode change'
  type: 'patch'
  type: 'file deletion'
  type: 'file creation'
type State = 'parsing header' | 'parsing hunks'
});
});
  [k: string]: PatchMutationPart['type'] | 'pragma' | 'header'
  '@': 'header',
  '-': 'deletion',
  '+': 'insertion',
  ' ': 'context',
  '\\': 'pragma',
  undefined: 'context',
};
  const result: FileDeets[] = [];
  let currentFilePatch: FileDeets = emptyFilePatch();
  let state: State = 'parsing header';
  let currentHunk: Hunk | null = null;
  let currentHunkMutationPart: PatchMutationPart | null = null;
        currentHunk.parts.push(currentHunkMutationPart);
        currentHunkMutationPart = null;
      currentFilePatch.hunks!.push(currentHunk);
      currentHunk = null;
    commitHunk();
    result.push(currentFilePatch);
    currentFilePatch = emptyFilePatch();
    const line = lines[i];

    if (state === 'parsing header') {
      if (line.startsWith('@@')) {
        state = 'parsing hunks';
        currentFilePatch.hunks = [];
        i--;
      } else if (line.startsWith('diff --git ')) {
          commitFilePatch();
        const match = line.match(/^diff --git a\/(.*?) b\/(.*?)\s*$/);
          throw new Error('Bad diff line: ' + line);
        currentFilePatch.diffLineFromPath = match[1];
        currentFilePatch.diffLineToPath = match[2];
      } else if (line.startsWith('old mode ')) {
        currentFilePatch.oldMode = line.slice('old mode '.length).trim();
      } else if (line.startsWith('new mode ')) {
        currentFilePatch.newMode = line.slice('new mode '.length).trim();
      } else if (line.startsWith('deleted file mode ')) {
          .slice('deleted file mode '.length)
          .trim();
      } else if (line.startsWith('new file mode ')) {
          .slice('new file mode '.length)
          .trim();
      } else if (line.startsWith('rename from ')) {
        currentFilePatch.renameFrom = line.slice('rename from '.length).trim();
      } else if (line.startsWith('rename to ')) {
        currentFilePatch.renameTo = line.slice('rename to '.length).trim();
      } else if (line.startsWith('index ')) {
        const match = line.match(/(\w+)\.\.(\w+)/);
          continue;
        currentFilePatch.beforeHash = match[1];
        currentFilePatch.afterHash = match[2];
      } else if (line.startsWith('--- ')) {
        currentFilePatch.fromPath = line.slice('--- a/'.length).trim();
      } else if (line.startsWith('+++ ')) {
        currentFilePatch.toPath = line.slice('+++ b/'.length).trim();
      if (supportLegacyDiffs && line.startsWith('--- a/')) {
        state = 'parsing header';
        commitFilePatch();
        i--;
        continue;
      const lineType = hunkLinetypes[line[0]] || null;
        case 'header':
          commitHunk();
          currentHunk = emptyHunk(line);
          break;
          state = 'parsing header';
          commitFilePatch();
          i--;
          break;
        case 'pragma':
          if (!line.startsWith('\\ No newline at end of file')) {
            throw new Error('Unrecognized pragma in patch file: ' + line);
              'Bad parser state: No newline at EOF pragma encountered without context',
            );
          currentHunkMutationPart.noNewlineAtEndOfFile = true;
          break;
        case 'insertion':
        case 'deletion':
        case 'context':
              'Bad parser state: Hunk lines encountered before hunk header',
            );
            currentHunk.parts.push(currentHunkMutationPart);
            currentHunkMutationPart = null;
            };
          currentHunkMutationPart.lines.push(line.slice(1));
          break;
  commitFilePatch();
        verifyHunkIntegrity(hunk);
  return result;
  const result: ParsedPatchFile = [];
    } = file;
    const type: PatchFilePart['type'] = renameFrom
      ? 'rename'
      ? 'file deletion'
      ? 'file creation'
      ? 'patch'
      : 'mode change';
    let destinationFilePath: string | null = null;
      case 'rename':
          throw new Error('Bad parser state: rename from & to not given');
          type: 'rename',
        });
        destinationFilePath = renameTo;
        break;
      case 'file deletion': {
        const path = diffLineFromPath || fromPath;
          throw new Error('Bad parse state: no path given for file deletion');
          type: 'file deletion',
        });
        break;
      case 'file creation': {
        const path = diffLineToPath || toPath;
          throw new Error('Bad parse state: no path given for file creation');
          type: 'file creation',
        });
        break;
      case 'patch':
      case 'mode change':
        destinationFilePath = toPath || diffLineToPath;
        break;
        type: 'mode change',
      });
        type: 'patch',
      });
  return result;
  const parsedMode = parseInt(mode, 8) & 0o777;
    throw new Error('Unexpected file mode string: ' + mode);
  return parsedMode;
  const lines = file.split(/\n/g);
  if (lines[lines.length - 1] === '') {
    lines.pop();
    );
      e.message === 'hunk header integrity check failed'
      );
    throw e;
  let originalLength = 0;
  let patchedLength = 0;
      case 'context':
        patchedLength += lines.length;
        originalLength += lines.length;
        break;
      case 'deletion':
        originalLength += lines.length;
        break;
      case 'insertion':
        patchedLength += lines.length;
        break;
    throw new Error('hunk header integrity check failed');