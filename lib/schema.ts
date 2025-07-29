import {pgTable, text , uuid ,integer, boolean, timestamp} from 'drizzle-orm/pg-core'
import {relations} from 'drizzle-orm'


export const files = pgTable('files',{
    id : uuid("id").defaultRandom().primaryKey(),
    
    name :text("name").notNull(),
    path : text('path').notNull(),// /doc/fold/cv.pdf
    size : integer('size').notNull(),
    type : text("type").notNull(), // instead of bool file/folder we use string
    // image png ,  image jpeg , gif , mp4 ...



    fileUrl : text("fileUrl").notNull(),
    thumbnailUrl : text("thumbnailUrl"),
    fileId : text("fileId"),


    userId : text("userId").notNull(),
    parentId  : uuid('parentId'), // simple graph really , null for root items (this is why not notNull ) ; we could have defined the root to be root
    
    
    isFolder : boolean('isFolder').default(false).notNull(),
    isStarred : boolean('isStared').default(false).notNull(),
    isDeleted: boolean('isDeleted').default(false).notNull(),



    createdAt  : timestamp("createdAt").defaultNow().notNull() ,
    updatedAt : timestamp('updatedAt').defaultNow().notNull(),
    

})


export const fileRelations = relations(files,({one, many})=>({
    children : many(files),

    parent : one(files,{
        fields:[files.parentId],
        references : [files.id],
    })


}))



export const File = typeof files.$inferSelect
export const NewFile = typeof files.$inferInsert




