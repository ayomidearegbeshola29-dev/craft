const fs=require('fs'),path=require('path')
const base='C:/Users/user/Desktop/DRIPS/craft/craft/packages/logger'
fs.mkdirSync(base+'/src/__tests__',{recursive:true})
fs.writeFileSync(base+'/src/types.ts',[
  '/** Log severity levels */',
