const fs = require('fs');
const content = fs.readFileSync('src/components/SaaSDashboard.tsx', 'utf-8');
const lines = content.split('\n');

let stack = [];
let insideMain = false;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('<main')) {
    insideMain = true;
    console.log(`[${i+1}] START MAIN`);
    stack.push({tag: 'main', line: i+1});
  } else if (line.includes('</main>')) {
    console.log(`[${i+1}] END MAIN, stack top is ${stack[stack.length-1].tag} from line ${stack[stack.length-1].line}`);
    break;
  }
  
  if (insideMain) {
    const tokens = [];
    const openMatches = [...line.matchAll(/<(div|button|span|p|svg|h1|h2|h3|h4|h5|h6|label|ul|li|strong|path|defs|linearGradient|stop|foreignObject|g)[^>]*(?<!\/)>/g)];
    for (const m of openMatches) tokens.push({type: 'open', tag: m[1], pos: m.index});
    
    const closeMatches = [...line.matchAll(/<\/(div|button|span|p|svg|h1|h2|h3|h4|h5|h6|label|ul|li|strong|path|defs|linearGradient|stop|foreignObject|g)>/g)];
    for (const m of closeMatches) tokens.push({type: 'close', tag: m[1], pos: m.index});
    
    tokens.sort((a,b) => a.pos - b.pos);
    
    for (const t of tokens) {
      if (t.type === 'open') {
        stack.push({tag: t.tag, line: i+1});
      } else {
        if (stack.length > 0 && stack[stack.length-1].tag === t.tag) {
          stack.pop();
        } else {
          console.log(`[${i+1}] MISMATCH CLOSE: </${t.tag}>, expected </${stack.length ? stack[stack.length-1].tag : 'NONE'}> from line ${stack.length ? stack[stack.length-1].line : '?'}`);
          // try to recover by peeking up to 3 levels
          let found = false;
          for(let k=1; k<=3 && stack.length-k >=0; k++) {
              if (stack[stack.length-k].tag === t.tag) {
                  console.log(`Recovered by popping ${k} elements.`);
                  for(let j=0; j<k; j++) stack.pop();
                  found = true;
                  break;
              }
          }
          if (!found && stack.length > 0) stack.pop();
        }
      }
    }
  }
}
