import * as dotenv from 'dotenv'
import {Config, defineConfig} from 'drizzle-kit';


dotenv.config({
    path : ".env",
})

if (!process.env.DATABASE_URL) {
    throw new Error("DB URL not set in ENV")
}

export default defineConfig({
    out : './drizzle',
    schema: './lib/schema.ts',
    dialect : 'postgresql',
    dbCredentials : {
        url : process.env.DATABASE_URL!,
    },

    migrations: { 
        table : "__drizzle_migration",
        schema : "public",
    },
    verbose :true , 
    strict : true , 
    
} as Config);
