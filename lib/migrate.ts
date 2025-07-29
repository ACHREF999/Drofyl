import {migrate} from 'drizzle-orm/neon-http/migrator';
import {drizzle} from 'drizzle-orm/neon-http';
import {neon} from '@neondatabase/serverless';
import  * as dotenv from 'dotenv';

dotenv.config({path:'.env'})

if (!process.env.DATABASE_URL){
    throw new Error("DB URL not found in env")
}



async function RunMigration(){
    try{
        const sql = neon(process.env.DATABASE_URL!)
        const db = drizzle(sql)

        await migrate(db,{migrationsFolder : './drizzle'})

        console.log('Succesfully Migrated DB')
    }catch(e){
        console.log(e);
        

        console.error('Failed to Migrate DB')
        process.exit(1);

    }
}


RunMigration()





