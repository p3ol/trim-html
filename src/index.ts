export interface TrimHtmlOptions {
  limit?: number;
  preserveTags?: boolean;
  wordBreak?: boolean;
  suffix?: string;
  moreLink?: string;
  moreText?: string;
  preserveWhiteSpace?: boolean;
  spaceChars?: string[];
}

export function trimHtml (html: string, options?: TrimHtmlOptions) {
  options = options || {};

  const limit = options.limit || 100;
  const preserveTags = options.preserveTags ?? true;
  const wordBreak = options.wordBreak ?? false;
  const suffix = options.suffix ?? '...';
  const moreLink = options.moreLink ?? '';
  const moreText = options.moreText ?? '»';
  const preserveWhiteSpace = options.preserveWhiteSpace || false;
  const spaceChars = options.spaceChars ?? [
    // Normal space
    ' ',
    // Insecable space (&#xA0;)
    ' ',
    // Han script special spaces
    '、', '。',
  ];

  const arr = html.replace(/</g, '\n<')
    .replace(/>/g, '>\n')
    .replace(/\n\n/g, '\n')
    .replace(/^\n/g, '')
    .replace(/\n$/g, '')
    .split('\n');

  let sum: number = 0;
  let row: string;
  let cut: number;
  let add: number;
  let rowCut: string;
  let tagMatch: string[];
  let tagName: string;
  const tagStack: string[] = [];
  let more = false;

  for (let i = 0; i < arr.length; i++) {
    row = arr[i];

    // count multiple spaces as one character
    if (!preserveWhiteSpace) {
      rowCut = row.replace(/[ ]+/g, ' ');
    } else {
      rowCut = row;
    }

    if (!row.length) {
      continue;
    }

    const charArr = getCharArr(rowCut);

    if (row[0] !== '<') {
      if (sum >= limit) {
        row = '';
      } else if ((sum + charArr.length) >= limit) {
        cut = limit - sum;

        if (spaceChars.includes(charArr[cut - 1])) {
          while (cut){
            cut -= 1;

            if(!spaceChars.includes(charArr[cut - 1])){
              break;
            }
          }
        } else {
          add = charArr.slice(cut).findIndex(c => spaceChars.includes(c));

          // break on half of word
          if (!wordBreak) {
            if (add !== -1) {
              cut += add;
            } else {
              cut = row.length;
            }
          }
        }

        row = charArr.slice(0, cut).join('') + suffix;

        if (moreLink) {
          row += '<a href="' + moreLink + '" style="display:inline">' +
            moreText + '</a>';
        }

        sum = limit;
        more = true;
      } else {
        sum += charArr.length;
      }
    } else if (!preserveTags) {
      row = '';
    } else if (sum >= limit) {
      tagMatch = row.match(/[a-zA-Z]+/);
      tagName = tagMatch ? tagMatch[0] : '';

      if (tagName) {
        if (row.substring(0, 2) !== '</') {
          tagStack.push(tagName);
          row = '';
        } else {
          while (tagStack[tagStack.length - 1] !== tagName && tagStack.length) {
            tagStack.pop();
          }

          if (tagStack.length) {
            row = '';
          }

          tagStack.pop();
        }
      } else {
        row = '';
      }
    }

    arr[i] = row;
  }

  return {
    html: arr
      .join('\n')
      .replace(/\n/g, ''),
    more,
  };
}

function getCharArr (rowCut: string) {
  const charArr: string[] = [];
  let subRow: string;
  let match: string[];
  let char: string;

  for (let i = 0; i < rowCut.length; i++) {
    subRow = rowCut.substring(i);
    match = subRow.match(/^&[a-z0-9#]+;/);

    if (match) {
      char = match[0];
      charArr.push(char);
      i += (char.length - 1);
    } else {
      charArr.push(rowCut[i]);
    }
  }

  return charArr;
}
