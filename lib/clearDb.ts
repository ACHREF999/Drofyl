import db from '@/lib';
import {files} from '@/lib/schema';




db.delete(files).then(res=>{
    console.log(res)
    return true
})
