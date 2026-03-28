const fs=require('fs')
const base='C:/Users/user/Desktop/DRIPS/craft/craft/packages/errors'
let h=fs.readFileSync(base+'/src/http.ts','utf8')
h=h.replace('  [ErrorCode.SERVER_TIMEOUT]:503,\n}','  [ErrorCode.SERVER_TIMEOUT]:503,\n} as const')
fs.writeFileSync(base+'/src/http.ts',h,'utf8')
const pkg=JSON.parse(fs.readFileSync(base+'/package.json','utf8'))
pkg.type='module'
pkg.sideEffects=false
fs.writeFileSync(base+'/package.json',JSON.stringify(pkg,null,2),'utf8')
const cfg=[
  'import { defineConfig } from "vitest/config"',
  '',
  'export default defineConfig({',
  '  test: {',
  '    include: ["src/__tests__/**/*.test.ts"],',
  '    coverage: { provider: "v8", include: ["src/**"], exclude: ["src/__tests__/**"] },',
  '},',
  '})',
].join('\n')
fs.writeFileSync(base+'/vitest.config.ts',cfg,'utf8')
console.log('patched')
