export interface ArticleBlock { kind:'h2'|'h3'|'p'; text:string; id:string }
export function parseArticle(body:string):ArticleBlock[]{
 let heading=0
 return body.replace(/\r\n/g,'\n').split(/\n{2,}/).flatMap(chunk=>{
  // Headings also work without an empty line after them. Text is rendered with Vue interpolation.
  const lines=chunk.split('\n'),blocks:ArticleBlock[]=[];let paragraph:string[]=[]
  const flush=()=>{if(paragraph.length){blocks.push({kind:'p',text:paragraph.join('\n'),id:''});paragraph=[]}}
  for(const line of lines){const match=line.match(/^(#{2,3})\s+(.+)$/);if(match){flush();blocks.push({kind:match[1].length===2?'h2':'h3',text:match[2],id:'section-'+(++heading)})}else if(line.trim())paragraph.push(line)}flush();return blocks
 })
}
