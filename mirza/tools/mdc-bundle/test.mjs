import { parse } from './entry.js'

const cases = [
  [
    'nested containers (card-group > card x2)',
    `::card-group
  ::card{title="Docs" icon="i-lucide-book" to="https://example.com"}
  محتوای کارت اول
  ::
  ::card{title="API"}
  محتوای کارت دوم
  ::
::
`,
  ],
  [
    'frontmatter-style props on a block component',
    `::field{name="token" type="string" required=true}
توضیح پارامتر
::
`,
  ],
  [
    'inline directive with span content',
    `این یک :badge[نسخه ۲]{color="green"} است در وسط متن.
`,
  ],
  [
    'code fence with bracket label',
    '```bash [install.sh]\nnpm install\n```\n',
  ],
  [
    'persian RTL prose + heading + component mix',
    `## عنوان دوم

این یک پاراگراف فارسی است با متن راست‌به‌چپ و اعداد ۱۲۳۴۵۶۷۸۹۰.

::card{title="سلام"}
محتوای فارسی داخل کارت با ی و ك عربی/فارسی: يك دو سه.
::
`,
  ],
  [
    'plain markdown, no components',
    `## Just a heading

Just a plain paragraph with **bold** and _italic_ text.
`,
  ],
  [
    'unknown/typo component name',
    `::crad{title="typo"}
content
::
`,
  ],
]

for (const [label, md] of cases) {
  console.log('='.repeat(70))
  console.log(label)
  console.log('-'.repeat(70))
  console.log('INPUT:')
  console.log(md)
  console.log('OUTPUT:')
  console.log(parse(md))
  console.log()
}
