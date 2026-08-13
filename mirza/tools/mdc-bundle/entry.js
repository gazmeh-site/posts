import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMdc from 'remark-mdc'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

// remark-mdc produces three custom mdast node types that have no built-in
// mdast -> hast handler in remark-rehype/mdast-util-to-hast:
//   - containerComponent  (::name{...} ... ::)
//   - leafComponent       (::name{...} with no closing/content, single line)
//   - textComponent       (:name[label]{...} inline, and plain text runs)
//
// Each carries `name` (kebab-cased component name) and `attributes`
// (a plain string-keyed object of prop values, already unescaped) plus
// `children` (further mdast nodes). We map them straight onto HTML
// elements named after the component, e.g. `::card-group` -> <card-group>,
// so the browser can style/detect them with plain CSS/JS.
//
// `component-slot` is what remark-mdc emits for named slots
// (`#description` inside a block component) - map it the same way.
function componentHandler(state, node) {
  const properties = { ...(node.attributes || {}) }
  delete properties.__order__
  return {
    type: 'element',
    tagName: node.name || 'div',
    properties,
    children: state.all(node),
  }
}

const mdcHandlers = {
  containerComponent: componentHandler,
  leafComponent: componentHandler,
  textComponent(state, node) {
    // Plain text runs inside components use name "text" with no children;
    // MDC's own `span` wrapper (used for `[text]{.class}` spans) and named
    // inline components (`:badge[label]{...}`) both carry a real name.
    if (!node.name || node.name === 'text') {
      return { type: 'text', value: node.value || '' }
    }
    return componentHandler(state, node)
  },
  'component-slot': componentHandler,
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMdc)
  .use(remarkRehype, { allowDangerousHtml: true, handlers: mdcHandlers })
  .use(rehypeStringify, { allowDangerousHtml: true })

export function parse(markdown) {
  return processor.processSync(markdown).toString()
}
